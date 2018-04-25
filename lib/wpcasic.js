'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:ASIC');
const memoryMapper = require('./mapper/memory.js');
const hardwareMapper = require('./mapper/hardware.js');

const BoardWpc = require('./boards/wpc.js');
const BoardExternalIo = require('./boards/externalIo.js');
const BoardDotMatrix = require('./boards/dmd.js');

const BANK_SIZE = 16 * 1024;

module.exports = {
  getInstance
};

function getInstance(romObject, interruptCallback) {
  return new WpcAsic(romObject, interruptCallback);
}

// The ASIC generates the reset, IRQ, and FIRQ signals which are sent to the CPU.
class WpcAsic {

  constructor(romObject, interruptCallback) {
    this.ram = Buffer.from(new Uint8Array(memoryMapper.MEMORY_ADDR_RAM));
    this.romSizeMBit = romObject.romSizeMBit;
    this.systemRom = romObject.systemRom;
    this.gameRom = romObject.gameRom;
    this.interruptCallback = interruptCallback;

    this.boardWpc = BoardWpc.getInstance(this.romSizeMBit, interruptCallback);
    this.boardExternalIo = BoardExternalIo.getInstance(interruptCallback);
    this.boardDmd = BoardDotMatrix.getInstance(interruptCallback);
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

    setTimeout(() => {
      setInterval(() => {
        debug('IRQ');
        console.log('IRQ');
        this.interruptCallback.irq();
      }, 10);

    }, 2000);
    setTimeout(() => {
      console.log('firq now');
      this.interruptCallback.irq();
    }, 12000);
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

  read8(offset) {
    if (isNaN(offset)) {
      debug('MEMORY READ BUG DETECTED!');
      return;
    }

    const address = memoryMapper.getAddress(offset);
    //debug('read from adr %o', { address, offset: offset.toString(16) });
    switch (address.subsystem) {

      case memoryMapper.SUBSYSTEM_RAM:
        return this.ram.readUInt8(address.offset);

      case memoryMapper.SUBSYSTEM_HARDWARE:
        return this._hardwareRead(address.offset);

      case memoryMapper.SUBSYSTEM_BANKSWITCHED:
        return this._bankswitchedRead(address.offset);

      case memoryMapper.SUBSYSTEM_SYSTEM:
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
        return this.ram.writeUInt8(value, address.offset);

      case memoryMapper.SUBSYSTEM_HARDWARE:
        this._hardwareWrite(offset, value);
        break;
/*
wpcemu:ASIC WARNING! bankswitched write NOT possible +0ms 0x336b 0x736b
wpcemu:ASIC WARNING! bankswitched write NOT possible +1ms 0x24be 0x64be
wpcemu:ASIC WARNING! bankswitched write NOT possible +0ms 0x0 0x4000

*/
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
    const pageOffset = offset + activeBank * BANK_SIZE;
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
