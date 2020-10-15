'use strict';

// Williams part number A-12742-xx

const debug = require('debug')('wpcemu:boards:cpu-board');
const memoryMapper = require('./mapper/memory.js');
const hardwareMapper = require('./mapper/hardware.js');
const timing = require('./static/timing');
const Asic = require('./asic.js');
const SoundBoard = require('./sound-board.js');
const ExternalIo = require('./external-io.js');
const MemoryHandler = require('./memory-handler.js');
const MemoryPatch = require('./elements/memory-patch');
const MemoryPatchGameId = require('./elements/memory-patch-game-id');
const MemoryPatchSkipBootCheck = require('./elements/memory-patch-skip-boot-check');
const DisplayBoard = require('./display-board.js');
const Cpu6809 = require('./up/cpu6809');

const ROM_BANK_SIZE = 16 * 1024;
const SERIALIZED_STATE_VERSION = 5;

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
    if (romObject.skipWpcRomCheck === true) {
      debug('skipWpcRomCheck TRUE');
      MemoryPatchSkipBootCheck.run(this.memoryPatch);
    }
    this.memoryWriteHandler = MemoryHandler.getInstance(romObject.memoryPosition, this.ram);

    const readMemory = this._read8.bind(this);
    const writeMemory = this._write8.bind(this);
    this.cpu = Cpu6809.getInstance(writeMemory, readMemory);

    const interruptCallback = {
      irq: this.cpu.irq,
      firqFromDmd: () => {
        this.cpu.firq();
        this.asic.firqSourceDmd(true);
      },
      reset: this.cpu.reset,
    };

    const initObject = {
      interruptCallback,
      romSizeMBit: this.romSizeMBit,
      romObject,
      ram: this.ram,
      hasAlphanumericDisplay: romObject.hasAlphanumericDisplay,
    };

    this.hasAlphaNumbericDisplay = romObject.hasAlphanumericDisplay;
    this.asic = Asic.getInstance(initObject);
    this.soundBoard = SoundBoard.getInstance(initObject);
    this.displayBoard = DisplayBoard.getInstance(initObject);
    this.externalIo = ExternalIo.getInstance();

    this.ticksIrq = 0;
    this.protectedMemoryWriteAttempts = 0;
    this.memoryWrites = 0;
  }

  reset() {
    console.log('RESET_CPU_BOARD');
    this.ticksIrq = 0;
    this.protectedMemoryWriteAttempts = 0;
    this.memoryWrites = 0;

    this.memoryPatch.removeVolatileEntries();
    this.displayBoard.reset();
    this.soundBoard.reset();
    this.asic.reset();
    this.cpu.reset();
  }

  getState() {
    const asic = {
      ram: this.memoryPatch.applyPatchesToExposedMemory(this.ram),
      wpc: this.asic.getState(),
      display: this.displayBoard.getState(),
      sound: this.soundBoard.getState(),
    };
    const cpuState = this.cpu.getState();
    return {
      asic,
      romFileName: this.romFileName,
      cpuState,
      protectedMemoryWriteAttempts: this.protectedMemoryWriteAttempts,
      memoryWrites: this.memoryWrites,
      ticksIrq: this.ticksIrq,
      version: SERIALIZED_STATE_VERSION,
    };
  }

  setState(stateObject) {
    if (!stateObject || !stateObject.asic || stateObject.version !== SERIALIZED_STATE_VERSION) {
      console.log('INVALID_STATE_VERSION_OR_DATA');
      return false;
    }

    this.cpu.setState(stateObject.cpuState);
    this.protectedMemoryWriteAttempts = stateObject.protectedMemoryWriteAttempts;
    this.memoryWrites = stateObject.memoryWrites;
    this.ticksIrq = stateObject.ticksIrq;
    this.asic.setState(stateObject.asic.wpc);
    this.displayBoard.setState(stateObject.asic.display);
    this.soundBoard.setState(stateObject.asic.sound);
    if (typeof stateObject.asic.ram === 'object') {
      this.ram.set(Uint8Array.from(stateObject.asic.ram), 0);
    }
  }

  setCabinetInput(value) {
    this.asic.setCabinetInput(value);
  }

  setSwitchInput(switchNr, optionalValue) {
    this.asic.setSwitchInput(switchNr, optionalValue);
  }

  setFliptronicsInput(value, optionalValue) {
    this.asic.setFliptronicsInput(value, optionalValue);
  }

  toggleMidnightMadnessMode() {
    this.asic.toggleMidnightMadnessMode();
  }

  setDipSwitchByte(dipSwitch) {
    this.asic.setDipSwitchByte(dipSwitch);
  }

  getDipSwitchByte() {
    return this.asic.getDipSwitchByte();
  }

  registerSoundBoardCallback(callbackFunction) {
    this.soundBoard.registerSoundBoardCallback(callbackFunction);
  }

  start() {
    console.log('RESET_SYSTEM');
    this.reset();
    debug('PC', this.cpu.getState().regPC);
  }

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

      this.displayBoard.executeCycle(singleTicks);
      this.asic.executeCycle(singleTicks);
    }

    debug('CPUSTATE %o', { ticks: this.cpu.tickCount, irqExecuted: this.cpu.irqCount, irqMissed: this.cpu.missedIRQ, firqExecuted: this.cpu.firqCount, firqMissed: this.cpu.missedFIRQ, });
    return ticksExecuted;
  }

  writeMemory(offset, value) {
    debug('writeMemory', { offset });
    this.memoryWriteHandler.writeMemory(offset, value);
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
          this.memoryWrites++;
        } else {
          debug('DID_NOT_WRITE_MEMORY_PROTECTED', offset.toString(16), value);
          this.protectedMemoryWriteAttempts++;
        }
        break;

      case memoryMapper.SUBSYSTEM_HARDWARE:
        this._hardwareWrite(offset, value);
        break;

      case memoryMapper.SUBSYSTEM_SYSTEMROM:
        debug('SYSTEMROM_WRITE', { offset: offset.toString(16), value });
        console.log('SYSTEMROM_WRITE', { offset: offset.toString(16), value });
        this.systemRom[address.offset] = value;
        break;

      default:
        console.log('CPU_WRITE8_FAIL', JSON.stringify(address), offset, value);
        //throw new Error('INVALID_WRITE_SUBSYSTEM_0x' + offset.toString(16));
    }
  }

  _bankswitchedRead(offset) {
    const activeBank = this.asic.romBank;
    const pageOffset = offset + activeBank * ROM_BANK_SIZE;
    debug('R_GAMEROM_BANK %o', { activeBank, offset, pageOffset, data: this.gameRom[pageOffset], romlength: this.gameRom.length });
    return this.gameRom[pageOffset] || 0;
  }

  _hardwareWrite(offset, value) {
    // write/mirror value to ram, so its visible using the memory monitor
    this.ram[offset] = value;

    const address = hardwareMapper.getAddress(offset, this.hasAlphaNumbericDisplay);
    switch (address.subsystem) {
      case hardwareMapper.SUBSYSTEM_DISPLAY:
        this.displayBoard.write(offset, value);
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
      default:
        console.log(JSON.stringify(address));
        throw new Error('CPUBOARD_INVALID_HW_WRITE');
    }
  }

  _hardwareRead(offset) {
    const address = hardwareMapper.getAddress(offset, this.hasAlphaNumbericDisplay);
    switch (address.subsystem) {
      case hardwareMapper.SUBSYSTEM_DISPLAY:
        return this.displayBoard.read(offset);
      case hardwareMapper.SUBSYSTEM_EXTERNAL_IO:
        return this.externalIo.read(offset);
      case hardwareMapper.SUBSYSTEM_SOUND:
        return this.soundBoard.readInterface(offset);
      case hardwareMapper.SUBSYSTEM_WPCIO:
        return this.asic.read(offset);
      default:
        console.log(JSON.stringify(address));
        throw new Error('INVALID_HW_READ');
    }
  }

}
