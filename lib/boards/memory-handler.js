const debug = require('debug')('wpcemu:boards:memory-handler');
const Checksum = require('./memory/checksum');

module.exports = {
  getInstance,
};

/*
 * write to RAM of the WPC-EMU and optionally update checksum of certain parts
 *
 * Example
 * HIGHSCORE MM, starts at 0x1D29, ends at 0x1D48, 16bit checksum is at 0x1D49 and 0x1D4A, here is a dump
 *  0x42, 0x52, 0x45, 0x0, 0x44, 0x0, 0x0, 0x0, 0x4c, 0x46, 0x53, 0x0, 0x40, 0x0, 0x0, 0x0, 0x5a, 0x41, 0x50, 0x0, 0x36, 0x0, 0x0, 0x0, 0x52, 0x43, 0x46, 0x0, 0x32, 0x0, 0x0, 0x0, 0xfb, 0x8f
 *
 *  -> data is 0x42, 0x52, 0x45, 0x0, 0x44, 0x0, 0x0, 0x0, 0x4c, 0x46, 0x53, 0x0, 0x40, 0x0, 0x0, 0x0, 0x5a, 0x41, 0x50, 0x0, 0x36, 0x0, 0x0, 0x0, 0x52, 0x43, 0x46, 0x0, 0x32, 0x0, 0x0, 0x0
 *  -> checksum is 0xfb, 0x8f
 *     add 0xfb and 0x8f equals 1136 (0x470), checksum16 is calculated by 0xffff - (sum of bytes)
 */

function getInstance(config, ram) {
  return new MemoryHandler(config, ram);
}

class MemoryHandler {

  constructor(config, ram) {
    this.checksumPositions = config && config.checksum &&
      config.checksum.filter((entry) => {
        return Number.isInteger(entry.dataStartOffset) &&
          Number.isInteger(entry.dataEndOffset) &&
          Number.isInteger(entry.checksumOffset);
      });
    this.ram = ram;
    debug('MEMORY_WRITE_HANDLER_INITIALIZED');
  }

  /**
   * modify emulator memory
   * @param {Number} offset of memory, must be between 0..0x3FFF
   * @param {Number|String|Array} value to write to the memory location
   */
  writeMemory(offset, value) {
    if (Array.isArray(value)) {
      value.forEach((char) => {
        this.ram[offset++] = char;
      });
    } else if (typeof value === 'string') {
      value.split('').forEach((char) => {
        this.ram[offset++] = char;
      });
    } else {
      this.ram[offset] = value;
    }

    const needToUpdateChecksum = this.checksumPositions && this._needsChecksumUpdate(offset);
    if (needToUpdateChecksum) {
      const ramRangeToChecksum = this.ram.subarray(needToUpdateChecksum.dataStartOffset, needToUpdateChecksum.dataEndOffset + 1);
      const checksum = Checksum.checksum16(ramRangeToChecksum);
      this.ram[needToUpdateChecksum.checksumOffset] = (checksum >>> 8) & 0xFF;
      this.ram[needToUpdateChecksum.checksumOffset + 1] = checksum & 0xFF;
    }
  }

  _needsChecksumUpdate(offset) {
    return this.checksumPositions.find((checksumPosition) => {
      return offset >= checksumPosition.dataStartOffset && offset <= checksumPosition.dataEndOffset;
    });
  }
}
