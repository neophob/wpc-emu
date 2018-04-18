'use strict';

const debug = require('debug')('wpcemu:memory');
const memoryMapper = require('./mapper/memory.js');
const hardwareMapper = require('./mapper/hardware.js');

class WpcAsic {

  constructor(romObject) {
    this.ram = Buffer.from(new Uint8Array(memoryMapper.MEMORY_ADDR_RAM));
    this.romSizeMBit = romObject.romSizeMBit;
    this.systemRom = romObject.systemRom;
    this.gameRom = romObject.gameRom;
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
        const hwAddress = hardwareMapper.getAddress(address.offset);
        debug('hardware read not implemented', hwAddress);
        break;

      case memoryMapper.SUBSYSTEM_BANKSWITCHED:
        debug('bankswitched read not implemented', address.offset);
        break;

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
        const hwAddress = hardwareMapper.getAddress(address.offset);
        debug('hardware write not implemented', hwAddress);
        break;

      case memoryMapper.SUBSYSTEM_BANKSWITCHED:
        debug('WARNING! bankswitched write possible', address.offset);
        break;

      case memoryMapper.SUBSYSTEM_SYSTEM:
        this.systemRom[address.offset] = value;
        break;

      default:
        throw Error('INVALID_WRITE_SUBSYSTEM');
    }
  }

}

module.exports = WpcAsic;
