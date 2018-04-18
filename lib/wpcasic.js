'use strict';

const debug = require('debug')('wpcemu:ASIC');
const memoryMapper = require('./mapper/memory.js');
const hardwareMapper = require('./mapper/hardware.js');

const BoardWpc = require('./boards/wpc.js');

class WpcAsic {

  constructor(romObject) {
    this.ram = Buffer.from(new Uint8Array(memoryMapper.MEMORY_ADDR_RAM));
    this.romSizeMBit = romObject.romSizeMBit;
    this.systemRom = romObject.systemRom;
    this.gameRom = romObject.gameRom;

    this.boardWpc = BoardWpc.getInstance();
  }

  read8(offset) {
    if (isNaN(offset)) {
      debug('MEMORY READ BUG DETECTED!');
      return;
    }

    const address = memoryMapper.getAddress(offset);
    debug('read from adr %o', { address, offset: offset.toString(16) });
    switch (address.subsystem) {

      case memoryMapper.SUBSYSTEM_RAM:
        return this.ram.readUInt8(address.offset);

      case memoryMapper.SUBSYSTEM_HARDWARE:
        return this._hardwareRead(offset);

      case memoryMapper.SUBSYSTEM_BANKSWITCHED:
        return this._bankswitchedRead(offset);

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

    const address = memoryMapper.getAddress(offset);
    debug('write to adr %o', { address, offset: offset.toString(16), value });
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
    debug('bankswitched read not implemented', activeBank, offset);
    return 0;
  }

  _hardwareWrite(offset, value) {
    const address = hardwareMapper.getAddress(offset);
    switch (address.subsystem) {
      case hardwareMapper.SUBSYSTEM_DMD:
        debug('SUBSYSTEM_DMD write not implemented', address, value);
        break;
      case hardwareMapper.SUBSYSTEM_EXTERNALIO:
        debug('externalIO write not implemented', address);
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
        debug('externalIO read not implemented', address);
        break;
      case hardwareMapper.SUBSYSTEM_WPCIO:
        return this.boardWpc.read(offset);
    }
  }

}

module.exports = WpcAsic;
