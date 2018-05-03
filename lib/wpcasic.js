'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:ASIC');
const memoryMapper = require('./mapper/memory.js');
const hardwareMapper = require('./mapper/hardware.js');

const BoardWpc = require('./boards/wpc.js');
const BoardExternalIo = require('./boards/externalIo.js');
const BoardDotMatrix = require('./boards/dmd.js');

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
    this.gameRom = romObject.gameRom;
    this.interruptCallback = interruptCallback;

    const initObject = {
      interruptCallback,
      ram: this.ram,
    };

    this.boardWpc = BoardWpc.getInstance(this.romSizeMBit, initObject);
    this.boardExternalIo = BoardExternalIo.getInstance(initObject);
    this.boardDmd = BoardDotMatrix.getInstance(initObject);

    // Disable ROM checksum check when booting
    this.systemRom[0xFFEC - 0x8000] = 0x00;
    this.systemRom[0xFFED - 0x8000] = 0xFF;
  }

  start() {
    debug('start');
    this.interruptCallback.reset();

/*
IRQ
IRQ is generated 976 times per second, about once every 1.02ms.  An
oscillator on the CPU board generates the frequency.

-> 976 calls/s -> each 1.025ms
-> 488 calls/500ms -> each 1.025ms
-> 244 calls/250ms -> each 1.025ms
-> 122 calls/125ms -> each 1.025ms
-> 61 calls/62.5ms -> each 1.025ms


FIRQ
FIRQ can be generated in two ways: from the dot matrix controller after a
certain scanline is redrawn, or from the high-performance timer.  When
an FIRQ is received, the CPU has to determine which of these occurred
to determine how to process it.

The DMD controller can interrupt via FIRQ when a particular scanline of
the display has just been sent to the display.  This can be used to
tell the CPU when to display a new frame.

The high precision timer can interrupt when its value reaches zero.

Either of these can be enabled/disabled individually, in addition to
masking the interrupt at the processor.

*/
  }

  getUiState() {
    return {
      ram: this.ram,
      wpc: this.boardWpc.getUiState(),
      dmd: this.boardDmd.getUiState(),
    };
  }

  isPeriodicIrqEnabled() {
    return this.boardWpc.periodicIRQTimerEnabled;
  }

  setZeroCrossFlag() {
    this.boardWpc.setZeroCrossFlag();
  }

  setCabinetInput(value) {
    this.boardWpc.setCabinetInput(value);
  }

  irqSourceDmd(fromDmd) {
    this.boardWpc.irqSourceDmd(fromDmd);
  }

  read8(offset) {
    if (isNaN(offset)) {
      debug('MEMORY READ BUG DETECTED!');
      return;
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
        throw Error('INVALID_READ_SUBSYSTEM');
    }
  }

  write8(offset, value) {
    if (isNaN(offset)) {
      debug('MEMORY WRITE OFFSET BUG DETECTED!');
      return;
    }
    if (value === undefined) {
      debug('MEMORY WRITE VALUE BUG DETECTED!');
      return;
    }

    value = value & 0xff;
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

      case memoryMapper.SUBSYSTEM_BANKSWITCHED:
        debug('WARNING! bankswitched write NOT possible', '0x' + address.offset.toString(16), '0x' + offset.toString(16));
        break;

      case memoryMapper.SUBSYSTEM_SYSTEM:
        this.systemRom[address.offset] = value;
        break;

      default:
        throw Error('INVALID_WRITE_SUBSYSTEM');
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
    }
  }

}
