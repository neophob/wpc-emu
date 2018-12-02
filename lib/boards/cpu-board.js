'use strict';

// Williams part number A-12742-xx

const debug = require('debug')('wpcemu:boards:cpu-board');
const memoryMapper = require('./mapper/memory.js');
const hardwareMapper = require('./mapper/hardware.js');
const timing = require('./static/timing');
const Asic = require('./asic.js');
// TODO remove me
const SoundBoard = require('./sound-board.js');
// TODO move to asic
const ExternalIo = require('./externalIo.js');
// TODO move to asic
const MemoryPatch = require('./elements/memory-patch');
const MemoryPatchGameId = require('./elements/memory-patch-game-id');
const MemoryPatchSkipBootCheck = require('./elements/memory-patch-skip-boot-check');
const DmdBoard = require('./dmd-board.js');
const UiFacade = require('./ui');
const Cpu6809 = require('./up/cpu6809');
//const Cpu6809 = require('./up/mc6809adapter');

const ROM_BANK_SIZE = 16 * 1024;

module.exports = {
  getInstance
};

function getInstance(romObject) {
  return new WpcCpuBoard(romObject);
}

class WpcCpuBoard {

  constructor(romObject) {
    this.ram = new Uint8Array(memoryMapper.MEMORY_ADDR_HARDWARE).fill(0);
    this.romSizeMBit = romObject.romSizeMBit;
    this.systemRom = romObject.systemRom;
    this.romFileName = romObject.fileName;
    this.gameRom = romObject.gameRom;
    this.memoryPatch = MemoryPatch.getInstance();
    if (romObject.gameIdMemoryLocation) {
      MemoryPatchGameId.run(this.memoryPatch, romObject.gameIdMemoryLocation);
    }
    if (romObject.skipWmcRomCheck === true) {
      debug('skipWmcRomCheck TRUE');
      MemoryPatchSkipBootCheck.run(this.memoryPatch);
    }

    const readMemory = this._read8.bind(this);
    const writeMemory = this._write8.bind(this);
    this.cpu = Cpu6809.getInstance(writeMemory, readMemory, 'cpuboard');
    this.uiFacade = UiFacade.getInstance();

    const interruptCallback = {
      irq: this.cpu.irq,
      firq: () => {
        this.asic.firqSourceDmd(false);
        this.cpu.firq();
      },
      firqFromDmd: () => {
        this.asic.firqSourceDmd(true);
        this.cpu.firq();
      },
      clearIrqFlag: () => {
        this.cpu.clearIrqMasking();
      },
      clearFirqFlag: () => {
        this.cpu.clearFirqMasking();
      },
      reset: this.cpu.reset,
    };

    const initObject = {
      interruptCallback,
      romSizeMBit: this.romSizeMBit,
      romObject,
      ram: this.ram,
    };

    this.asic = Asic.getInstance(initObject);
    this.soundBoard = SoundBoard.getInstance(initObject);
    this.dmdBoard = DmdBoard.getInstance(initObject);
    this.externalIo = ExternalIo.getInstance();

    this.startTime = 0;
    this.ticksIrq = 0;
    this.ticksUpdateDmd = 0;
    this.protectedMemoryWriteAttempts = 0;
  }

  reset() {
    console.log('RESET_CPU_BOARD');
    this.startTime = 0;
    this.ticksIrq = 0;
    this.ticksUpdateDmd = 0;
    this.protectedMemoryWriteAttempts = 0;
    //don't clear ram to decrease reset time!
    //this.ram.fill(0);
    this.cpu.reset();
    this.asic.reset();
    this.dmdBoard.reset();
    this.soundBoard.reset();
  }

  getUiState() {
    const asic = this.uiFacade.getChangedState({
      ram: this.ram.slice(0, memoryMapper.MEMORY_ADDR_RAM),
      wpc: this.asic.getUiState(),
      dmd: this.dmdBoard.getUiState(),
    });
    // TODO use uiFacade
    asic.sound = this.soundBoard.getUiState();
    const ticks = this.cpu.tickCount;
    const cpuStatus = this.cpu.status();
    return {
      asic,
      romFileName: this.romFileName,
      ticks,
      missedIrqCall: cpuStatus.missedIRQ,
      missedFirqCall: cpuStatus.missedFIRQ,
      irqCount: cpuStatus.irqCount,
      firqCount: cpuStatus.firqCount,
      nmiCount: cpuStatus.nmiCount,
      protectedMemoryWriteAttempts: this.protectedMemoryWriteAttempts,
    };

  }

  setCabinetInput(value) {
    this.asic.setCabinetInput(value);
  }

  setInput(value) {
    this.asic.setInput(value);
  }

  setFliptronicsInput(value) {
    this.asic.setFliptronicsInput(value);
  }

  registerDacCallback(dacCallback) {
    this.soundBoard.registerDacCallback(dacCallback);
  }

  start() {
    console.log('RESET_SYSTEM');
    this.reset();
    debug('PC', this.cpu.status().pc);
  }

  mixStereo(audioBuffer, sampleCount, offset) {
    this.soundBoard.mixStereo(audioBuffer, sampleCount, offset);
  }

  //TODO check system.sched of the freewpc project
  executeCycle(ticksToRun, tickSteps) {
    let ticksExecuted = 0;
    while (ticksExecuted < ticksToRun) {
      const singleTicks = this.cpu.steps(tickSteps);
      ticksExecuted += singleTicks;
      this.ticksIrq += singleTicks;
      if (this.ticksIrq >= timing.CALL_IRQ_AFTER_TICKS) {
        this.ticksIrq -= timing.CALL_IRQ_AFTER_TICKS;
        // TODO isPeriodicIrqEnabled setting is from freeWpc project, unknown if the "real" WPC system implements this too
        // some games needs a manual irq trigger if this is implemented (like indiana jones)
        //if (this.asic.periodicIRQTimerEnabled) {
        this.cpu.irq();
        //}
      }

      this.ticksUpdateDmd += singleTicks;
      if (this.ticksUpdateDmd >= timing.CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS) {
        this.ticksUpdateDmd -= timing.CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS;
        this.dmdBoard.copyScanline();
      }

      this.asic.executeCycle(singleTicks);
    }

    this.soundBoard.executeCycle(ticksToRun, tickSteps);
    return ticksExecuted;
  }

  _read8(offset) {
    if (!offset && offset !== 0) {
      throw new TypeError('CPU_MEMORY_READ_BUG_DETECTED!');
    }

    const memoryPatch = this.memoryPatch.hasPatch(offset);
    if (memoryPatch) {
      return memoryPatch.value;
    }

    const address = memoryMapper.getAddress(offset);
    //debug('read from adr %o', { address, offset: offset.toString(16) });
    switch (address.subsystem) {

      case memoryMapper.SUBSYSTEM_RAM:
        //debug('READ RAM', address.offset);
        return this.ram[address.offset];

      case memoryMapper.SUBSYSTEM_HARDWARE:
        //debug('READ SUBSYSTEM_HARDWARE', address.offset);
        return this._hardwareRead(address.offset);

      case memoryMapper.SUBSYSTEM_BANKSWITCHED:
        //debug('READ SUBSYSTEM_BANKSWITCHED', address.offset);
        return this._bankswitchedRead(address.offset);

      case memoryMapper.SUBSYSTEM_SYSTEMROM:
        //debug('READ ROM', address.offset);
        return this.systemRom[address.offset];

      default:
        throw new Error('INVALID_READ_SUBSYSTEM');
    }
  }

  _write8(offset, value) {
    if (!offset && offset !== 0) {
      console.log('CPU_MEMORY_WRITE_BUG_DETECTED', { offset, value });
      throw new TypeError('CPU_MEMORY_WRITE_BUG_DETECTED!');
    }

    value &= 0xFF;
    const address = memoryMapper.getAddress(offset);
    //debug('write to adr %o', { address, offset: offset.toString(16), value });
    switch (address.subsystem) {

      case memoryMapper.SUBSYSTEM_RAM:
        if (this.asic.isMemoryProtectionEnabled() ||
          (offset & this.asic.memoryProtectionMask) !== this.asic.memoryProtectionMask) {
          this.ram[address.offset] = value;
        } else {
          debug('DID_NOT_WRITE_MEMORY_PROTECTED', offset, value);
          this.protectedMemoryWriteAttempts++;
        }
        break;

      case memoryMapper.SUBSYSTEM_HARDWARE:
        this._hardwareWrite(offset, value);
        break;

      default:
        console.log('CPU_WRITE8_FAIL', JSON.stringify(address), offset, value);
        //throw new Error('INVALID_WRITE_SUBSYSTEM_0x' + offset.toString(16));
    }
  }

  _bankswitchedRead(offset) {
    const activeBank = this.asic.romBank;
    if (Asic.SYSTEM_ROM_BANK_NUMBERS.includes(activeBank)) {
      const systemRomOffset = Asic.SYSTEM_ROM_BANK_NUMBERS.indexOf(activeBank) * ROM_BANK_SIZE;
      debug('bankswitched read from system rom', { activeBank, offset, systemRomOffset });
      return this.systemRom[offset + systemRomOffset];
    }
    const pageOffset = (offset + activeBank * ROM_BANK_SIZE);
    debug('bankswitched read from game rom %o', { activeBank, offset, pageOffset, data: this.gameRom[pageOffset], romlength: this.gameRom.length });
    return this.gameRom[pageOffset];
  }

  //TODO move to ASIC
  _hardwareWrite(offset, value) {
    const address = hardwareMapper.getAddress(offset);
    switch (address.subsystem) {
      case hardwareMapper.SUBSYSTEM_DMD:
        this.dmdBoard.write(offset, value);
        break;
      case hardwareMapper.SUBSYSTEM_EXTERNAL_IO:
        this.externalIo.write(offset, value);
        break;
      case hardwareMapper.SUBSYSTEM_SOUND:
        this.soundBoard.writeInterface(offset, value);
        break;
      case hardwareMapper.SUBSYSTEM_WPCIO:
        this.asic.write(offset, value);
        break;
      case hardwareMapper.SUBSYSTEM_EXPANSION:
        console.log('EXPANSION_WRITE_NOT_IMPL', { offset: '0x' + offset.toString(16), value });
        break;
      default:
        console.log(JSON.stringify(address));
        throw new Error('CPUBOARD_INVALID_HW_WRITE');
    }
  }

  //TODO move to ASIC
  _hardwareRead(offset) {
    const address = hardwareMapper.getAddress(offset);
    switch (address.subsystem) {
      case hardwareMapper.SUBSYSTEM_DMD:
        return this.dmdBoard.read(offset);
      case hardwareMapper.SUBSYSTEM_EXTERNAL_IO:
        return this.externalIo.read(offset);
      case hardwareMapper.SUBSYSTEM_SOUND:
        return this.soundBoard.readInterface(offset);
      case hardwareMapper.SUBSYSTEM_WPCIO:
        return this.asic.read(offset);
      case hardwareMapper.SUBSYSTEM_EXPANSION:
        console.log('EXPANSION_READ_NOT_IMPL', { offset: '0x' + offset.toString(16) });
        return 0x00;
      default:
        console.log(JSON.stringify(address));
        throw new Error('INVALID_HW_READ');
    }
  }

}
