'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:ASIC');
const memoryMapper = require('./mapper/memory.js');
const hardwareMapper = require('./mapper/hardware.js');
const timing = require('./timing');
const BoardWpc = require('./wpc.js');
const BoardExternalIo = require('./external-io.js');
const BoardDotMatrix = require('./dmd-board.js');
const ui = require('./ui');

const ROM_BANK_SIZE = 16 * 1024;

module.exports = {
  getInstance
};

function getInstance(romObject, interruptCallback) {
  return new WpcAsic(romObject, interruptCallback);
}

// The ASIC generates the reset, IRQ, and FIRQ signals which are sent to the CPU.
class WpcAsic {

  constructor(romObject, interruptCallback) {
    this.ram = new Uint8Array(memoryMapper.MEMORY_ADDR_HARDWARE).fill(0);
    this.romSizeMBit = romObject.romSizeMBit;
    this.systemRom = romObject.systemRom;
    this.romFileName = romObject.fileName;
    this.gameRom = romObject.gameRom;
    this.interruptCallback = interruptCallback;
    this.ui = ui.getInstance();

    const initObject = {
      interruptCallback,
      ram: this.ram,
    };

    this.boardWpc = BoardWpc.getInstance(this.romSizeMBit, initObject);
    this.boardExternalIo = BoardExternalIo.getInstance(initObject);
    this.boardDmd = BoardDotMatrix.getInstance(initObject);

    this.ticksUpdateDmd = 0;

    if (romObject.skipWmcRomCheck === true) {
      console.log('skipWmcRomCheck TRUE');
      // Disable ROM checksum check when booting (U6)
      // NOTE: enabling this will make FreeWPC games crash!
      this.systemRom[0xFFEC - 0x8000] = 0x00;
      this.systemRom[0xFFED - 0x8000] = 0xFF;
    }
  }

  getUiState() {
    return this.ui.getChangedState({
      romFileName: this.romFileName,
      ram: this.ram.slice(0, memoryMapper.MEMORY_ADDR_RAM),
      wpc: this.boardWpc.getUiState(),
      dmd: this.boardDmd.getUiState(),
    });
  }

  isPeriodicIrqEnabled() {
    return this.boardWpc.periodicIRQTimerEnabled;
  }

  setCabinetInput(value) {
    this.boardWpc.setCabinetInput(value);
  }

  setInput(value) {
    this.boardWpc.setInput(value);
  }

  //TODO rename to firqSourceDmd
  irqSourceDmd(fromDmd) {
    this.boardWpc.irqSourceDmd(fromDmd);
  }

  executeCycle(ticksExecuted) {
    this.ticksUpdateDmd += ticksExecuted;
    if (this.ticksUpdateDmd >= timing.CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS) {
      this.ticksUpdateDmd -= timing.CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS;
      this.boardDmd.copyScanline();
    }

    this.boardWpc.executeCycle(ticksExecuted);
  }

  read8(offset) {
    if (isNaN(offset)) {
      throw new Error('ASIC_MEMORY_READ_BUG_DETECTED!');
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

  write8(offset, value) {
    if (isNaN(offset)) {
      throw new Error('ASIC_MEMORY_WRITE_BUG_DETECTED!');
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
    const activeBank = this.boardWpc.romBank;
    //Pages 62 correspond to the uppermost 32KB
    if (activeBank === BoardWpc.SYSTEM_ROM_BANK_NUMBER1 || activeBank === BoardWpc.SYSTEM_ROM_BANK_NUMBER2) {
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
        this.boardDmd.write(offset, value);
        break;
      case hardwareMapper.SUBSYSTEM_EXTERNALIO:
        this.boardExternalIo.write(offset, value);
        break;
      case hardwareMapper.SUBSYSTEM_WPCIO:
        this.boardWpc.write(offset, value);
        break;
      default:
        throw new Error('INVALID_HW_WRITE');
    }
  }

  _hardwareRead(offset) {
    const address = hardwareMapper.getAddress(offset);
    switch (address.subsystem) {
      case hardwareMapper.SUBSYSTEM_DMD:
        return this.boardDmd.read(offset);
      case hardwareMapper.SUBSYSTEM_EXTERNALIO:
        return this.boardExternalIo.read(offset);
      case hardwareMapper.SUBSYSTEM_WPCIO:
        return this.boardWpc.read(offset);
      default:
        throw new Error('INVALID_HW_READ');
    }
  }

}
