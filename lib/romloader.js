'use strict';

const fs = require('fs');
const debug = require('debug')('wpcemu:romloader');

const WPC_ROM_SIZE_1MBIT = 128 * 1024;
const WPC_VALID_ROM_SIZES_IN_MBIT = [1,2,4,8];
const SYSTEM_ROM_SIZE_BYTES = 32 * 1024;
const SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET = 0x7FEC;

module.exports = {
  loadRom,
};

function readFileAsUint8Array(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) {
        return reject(error);
      }
      const buffer = new Uint8Array(data);
      resolve(buffer);
    });
  });
}

function parseRom(uint8Buffer) {
  return new Promise((resolve, reject) => {
    if (!uint8Buffer) {
      return reject(new Error('EMPTY_ROM'));
    }
    const romSizeMBit = uint8Buffer.length / WPC_ROM_SIZE_1MBIT;
    debug('rom size: %s bytes, mbit size: %s', uint8Buffer.length, romSizeMBit);

    const hasNotAlignedSize = !Number.isInteger(romSizeMBit);
    const hasInvalidSize = !WPC_VALID_ROM_SIZES_IN_MBIT.includes(romSizeMBit);
    if (hasNotAlignedSize || hasInvalidSize) {
      debug('romSizeMBit',romSizeMBit);
      return reject(new Error('INVALID_ROM_SIZE'));
    }

    //Contains the last 32 KiB of Game ROM
    const systemRom = uint8Buffer.subarray(uint8Buffer.length - SYSTEM_ROM_SIZE_BYTES, uint8Buffer.length);
    debug('systemRom checksum correction', systemRom[SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET]);
    debug('systemRom checksum', systemRom[SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET + 1]);
    debug('systemRom version', systemRom[SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET + 2]);
    const gameRom = uint8Buffer.subarray(0, uint8Buffer.length - SYSTEM_ROM_SIZE_BYTES);
    const romData = {
      romSizeMBit,
      systemRom,
      gameRom,
    };
    resolve(romData);
  });
}

/**
 * Returns a promise with
 * @function
 * @param {String} romPath file path to the rom to load
 * @return {promise} promise that contains the rom data as object: { romSizeMBit, systemRom, gameRom }.
*                    romSizeMBit is either 1 (128kb), 2 (256kb), 4 (512kb) or 8 (1024kb), the system rom is always 32kb
 */
function loadRom(romPath) {
  debug('loadRom:', romPath);
  return readFileAsUint8Array(romPath)
    .then((data) => {
      return parseRom(data);
    });
}
