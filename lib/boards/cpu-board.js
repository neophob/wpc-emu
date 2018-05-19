'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:cpu-board');
const memoryMapper = require('./mapper/memory.js');
const hardwareMapper = require('./mapper/hardware.js');
const timing = require('./timing');
const CpuBoardAsic = require('./cpu-board-asic.js');
const SoundBoard = require('./sound-board.js');
const DmdBoard = require('./dmd-board.js');
const UiFacade = require('./ui');
const CPU6809 = require('./up/cpu6809');

const ROM_BANK_SIZE = 16 * 1024;

module.exports = {
  getInstance
};

function getInstance(romObject) {
  return new WpcAsic(romObject);
}

// The ASIC generates the reset, IRQ, and FIRQ signals which are sent to the CPU.
class WpcAsic {

  constructor(romObject) {
    this.ram = new Uint8Array(memoryMapper.MEMORY_ADDR_HARDWARE).fill(0);
    this.romSizeMBit = romObject.romSizeMBit;
    this.systemRom = romObject.systemRom;
    this.romFileName = romObject.fileName;
    this.gameRom = romObject.gameRom;
    this.uiFacade = UiFacade.getInstance();

    const interruptCallback = {
      irq: CPU6809.irq,
      firq: () => {
        this.cpuBoardAsic.firqSourceDmd(false);
        CPU6809.firq();
      },
      firqFromDmd: () => {
        this.cpuBoardAsic.firqSourceDmd(true);
        CPU6809.firq();
      },
      clearIrqFlag: () => {
        //TODO removeme?
        //CPU6809.clearIrqMasking();
      },
      clearFirqFlag: () => {
        //TODO removeme?
        //CPU6809.clearFirqMasking();
      },
      reset: CPU6809.reset,
    };

    const initObject = {
      interruptCallback,
      romSizeMBit: this.romSizeMBit,
      romObject,
      ram: this.ram,
    };

    this.cpuBoardAsic = CpuBoardAsic.getInstance(initObject);
    this.soundBoard = SoundBoard.getInstance(initObject);
    this.dmdBoard = DmdBoard.getInstance(initObject);

    this.startTime = 0;
    this.ticksIrq = 0;
    this.ticksZeroCross = 0;
    this.ticksUpdateDmd = 0;

    if (romObject.skipWmcRomCheck === true) {
      this._disableWpcRomCheck();
    }
  }

  getUiState() {
    const asic = this.uiFacade.getChangedState({
      ram: this.ram.slice(0, memoryMapper.MEMORY_ADDR_RAM),
      wpc: this.cpuBoardAsic.getUiState(),
      dmd: this.dmdBoard.getUiState(),
    });
    const ticks = CPU6809.T();
    const cpuStatus = CPU6809.status();
    return {
      asic,
      romFileName: this.romFileName,
      ticks,
      missedIrqCall: cpuStatus.missedIRQ,
      missedFirqCall: cpuStatus.missedFIRQ,
    };

  }

  setCabinetInput(value) {
    this.cpuBoardAsic.setCabinetInput(value);
  }

  setInput(value) {
    this.cpuBoardAsic.setInput(value);
  }

  registerDacCallback(dacCallback) {
    this.soundBoard.registerDacCallback(dacCallback);
  }

  start() {
    //this.soundBoard.start();
    const readMemory = this._read8.bind(this);
    const writeMemory = this._write8.bind(this);
    CPU6809.init(writeMemory, readMemory);
    debug('PC', CPU6809.status().pc);
  }

  reset() {
    this.soundBoard.reset();
    CPU6809.reset();
    CPU6809.steps(2000000);
    CPU6809.irq();
  }

  executeCycle(ticksToRun, tickSteps) {
    //this.soundBoard.executeCycle(ticksToRun, tickSteps);

    let ticksExecuted = 0;
    while (ticksExecuted < ticksToRun) {
      const singleTicks = CPU6809.steps(tickSteps);
      ticksExecuted += singleTicks;
      this.ticksIrq += singleTicks;
      if (this.ticksIrq >= timing.CALL_IRQ_AFTER_TICKS) {
        this.ticksIrq -= timing.CALL_IRQ_AFTER_TICKS;
        // TODO isPeriodicIrqEnabled is from freeWpc, unknown if the "real" WPC system implements this too
        // some games needs a manual irq trigger if this is implemented (like indiana jones)
        //if (this.cpuBoard.isPeriodicIrqEnabled {
        CPU6809.irq();
        //}
      }

      this.ticksUpdateDmd += singleTicks;
      if (this.ticksUpdateDmd >= timing.CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS) {
        this.ticksUpdateDmd -= timing.CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS;
        this.dmdBoard.copyScanline();
      }

      this.cpuBoardAsic.executeCycle(singleTicks);
    }
    return ticksExecuted;
  }

  _disableWpcRomCheck() {
    debug('skipWmcRomCheck TRUE');
    // Disable ROM checksum check when booting (U6)
    // NOTE: enabling this will make FreeWPC games crash!
    this.systemRom[0xFFEC - 0x8000] = 0x00;
    this.systemRom[0xFFED - 0x8000] = 0xFF;
  }

  _read8(offset) {
    if (isNaN(offset)) {
      throw new TypeError('ASIC_MEMORY_READ_BUG_DETECTED!');
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
    if (isNaN(offset)) {
      throw new TypeError('ASIC_MEMORY_WRITE_BUG_DETECTED!');
    }
    if (value === undefined) {
      debug('MEMORY WRITE VALUE BUG DETECTED!');
      return;
    }

    value &= 0xFF;
    const address = memoryMapper.getAddress(offset);
    //debug('write to adr %o', { address, offset: offset.toString(16), value });
    switch (address.subsystem) {

      case memoryMapper.SUBSYSTEM_RAM:
        //debug('WRITE RAM', value, address.offset);
        this.ram[address.offset] = value;
        break;

      case memoryMapper.SUBSYSTEM_HARDWARE:
        this._hardwareWrite(offset, value);
        break;

      default:
        throw new Error('INVALID_WRITE_SUBSYSTEM_0x' + address.offset.toString(16));
    }
  }

  _bankswitchedRead(offset) {
    const activeBank = this.cpuBoardAsic.romBank;
    //Pages 62 correspond to the uppermost 32KB
    if (activeBank === CpuBoardAsic.SYSTEM_ROM_BANK_NUMBER1 || activeBank === CpuBoardAsic.SYSTEM_ROM_BANK_NUMBER2) {
      //debug('bankswitched read from system rom', activeBank, offset);
      return this.systemRom[offset];
    }
    const pageOffset = offset + activeBank * ROM_BANK_SIZE;
    //debug('bankswitched read from game rom', activeBank, pageOffset);
    return this.gameRom[pageOffset];
  }

  _hardwareWrite(offset, value) {
    const address = hardwareMapper.getAddress(offset);
    switch (address.subsystem) {
      case hardwareMapper.SUBSYSTEM_DMD:
        this.dmdBoard.write(offset, value);
        break;
      case hardwareMapper.SUBSYSTEM_SOUND:
        this.soundBoard.write(offset, value);
        break;
      case hardwareMapper.SUBSYSTEM_WPCIO:
        this.cpuBoardAsic.write(offset, value);
        break;
      default:
        throw new Error('INVALID_HW_WRITE');
    }
  }

  _hardwareRead(offset) {
    const address = hardwareMapper.getAddress(offset);
    switch (address.subsystem) {
      case hardwareMapper.SUBSYSTEM_DMD:
        return this.dmdBoard.read(offset);
      case hardwareMapper.SUBSYSTEM_SOUND:
        return this.soundBoard.read(offset);
      case hardwareMapper.SUBSYSTEM_WPCIO:
        return this.cpuBoardAsic.read(offset);
      default:
        throw new Error('INVALID_HW_READ');
    }
  }

}
