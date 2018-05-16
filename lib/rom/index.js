'use strict';

const debug = require('debug')('wpcemu:rom:loader');

const WPC_ROM_SIZE_1MBIT = 128 * 1024;
const WPC_VALID_ROM_SIZES_IN_MBIT = [1,2,4,8];
const SYSTEM_ROM_SIZE_BYTES = 32 * 1024;
const SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET = 0x7FEC;

module.exports = {
  parse,
};

function parse(uInt8Roms, metaData) {
  return new Promise((resolve, reject) => {
    if (!uInt8Roms) {
      return reject(new Error('EMPTY_ROM'));
    }

    let uInt8ArrayRom;
    let u14,u15,u18;
    let romSizeMBit;

    if (Array.isArray(uInt8Roms)) {
      debug('LOAD_GAME_ROM_AND_SOUND_ROM');
      uInt8ArrayRom = uInt8Roms[0];
      u14 = uInt8Roms[1];
      u15 = uInt8Roms[2];
      u18 = uInt8Roms[3];
      romSizeMBit = uInt8ArrayRom.length / WPC_ROM_SIZE_1MBIT;
      debug('systemRom size: %s bytes, mbit size: %s', uInt8ArrayRom.length, romSizeMBit);
      debug('u14 rom size: %s bytes', u14.length);
      debug('u15 rom size: %s bytes', u15.length);
      debug('u18 rom size: %s bytes', u18.length);
    } else {
      debug('LOAD_GAME_ROM');
      uInt8ArrayRom = uInt8Roms;
      romSizeMBit = uInt8ArrayRom.length / WPC_ROM_SIZE_1MBIT;
      debug('game rom size: %s bytes, mbit size: %s', uInt8ArrayRom.length, romSizeMBit);
    }

    const hasNotAlignedSize = !Number.isInteger(romSizeMBit);
    const hasInvalidSize = !WPC_VALID_ROM_SIZES_IN_MBIT.includes(romSizeMBit);
    if (hasNotAlignedSize || hasInvalidSize) {
      debug('romSizeMBit',romSizeMBit);
      return reject(new Error('INVALID_ROM_SIZE'));
    }

    // Contains the last 32 KiB of Game ROM
    const systemRom = uInt8ArrayRom.subarray(uInt8ArrayRom.length - SYSTEM_ROM_SIZE_BYTES, uInt8ArrayRom.length);
    debug('systemRom checksum correction', systemRom[SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET]);
    debug('systemRom checksum', systemRom[SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET + 1]);
    debug('systemRom version', systemRom[SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET + 2]);
    const gameRom = uInt8ArrayRom.subarray(0, uInt8ArrayRom.length - SYSTEM_ROM_SIZE_BYTES);
    const romData = {
      romSizeMBit,
      systemRom,
      gameRom,
      u14,
      u15,
      u18,
      fileName: metaData.fileName,
      skipWmcRomCheck: metaData.skipWmcRomCheck,
      switchesEnabled: metaData.switchesEnabled,
    };
    resolve(romData);
  });
}
