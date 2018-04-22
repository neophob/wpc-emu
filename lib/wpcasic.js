'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:ASIC');
const memoryMapper = require('./mapper/memory.js');
const hardwareMapper = require('./mapper/hardware.js');

const BoardWpc = require('./boards/wpc.js');
const BoardExternalIo = require('./boards/externalIo.js');

const BANK_SIZE = 16 * 1024;

class WpcAsic {

  constructor(romObject, interruptCallback) {
    this.ram = Buffer.from(new Uint8Array(memoryMapper.MEMORY_ADDR_RAM));
    this.romSizeMBit = romObject.romSizeMBit;
    this.systemRom = romObject.systemRom;
    this.gameRom = romObject.gameRom;

    this.boardWpc = BoardWpc.getInstance(this.romSizeMBit, interruptCallback);
    this.boardExternalIo = BoardExternalIo.getInstance();
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

      case memoryMapper.SUBSYSTEM_BANKSWITCHED:
        debug('WARNING! bankswitched write NOT possible', address.offset);
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
        debug('SUBSYSTEM_DMD write not implemented', '0x' + address.offset.toString(16), value);
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
        debug('SUBSYSTEM_DMD read not implemented', address);
        break;
      case hardwareMapper.SUBSYSTEM_EXTERNALIO:
        return this.boardExternalIo.read(offset);
      case hardwareMapper.SUBSYSTEM_WPCIO:
        return this.boardWpc.read(offset);
    }
  }

}

module.exports = WpcAsic;
