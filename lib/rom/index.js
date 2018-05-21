'use strict';

const debug = require('debug')('wpcemu:rom:loader');

const WPC_ROM_SIZE_1MBIT = 128 * 1024;
const WPC_VALID_ROM_SIZES_IN_MBIT = [1,2,4,8];
const SYSTEM_ROM_SIZE_BYTES = 32 * 1024;
const SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET = 0x7FEC;
const SOUNDBOARD_SYSTEM_ROM_SIZE = 0x4000;

module.exports = {
  parse,
};

function getSoundBoardSystemRom(u18Rom) {
  return u18Rom.subarray(u18Rom.length - SOUNDBOARD_SYSTEM_ROM_SIZE, u18Rom.length);
}

function getCpuBoardSystemRom(u06Rom) {
  const systemRom = u06Rom.subarray(u06Rom.length - SYSTEM_ROM_SIZE_BYTES, u06Rom.length);
  debug('systemRom checksum correction', systemRom[SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET]);
  debug('systemRom checksum', systemRom[SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET + 1]);
  debug('systemRom version', systemRom[SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET + 2]);
  return systemRom;
}

function getCpuBoardGameRom(u06Rom) {
  return u06Rom.subarray(0, u06Rom.length - SYSTEM_ROM_SIZE_BYTES);
}

function parse(uInt8Roms, metaData) {
  return new Promise((resolve, reject) => {
    if (typeof uInt8Roms !== 'object') {
      return reject(new Error('INVALID_ROM_DATA'));
    }

    debug('LOAD_GAME_ROM_AND_SOUND_ROM');
    const u06 = uInt8Roms.u06;
    const u14 = uInt8Roms.u14;
    const u15 = uInt8Roms.u15;
    const u18 = uInt8Roms.u18;
    const romSizeMBit = u06.length / WPC_ROM_SIZE_1MBIT;

    debug('u14 rom size: %s bytes', u14.length);
    debug('u15 rom size: %s bytes', u15.length);
    debug('u18 rom size: %s bytes', u18.length);
    debug('systemRom (u06) size: %s bytes, mbit size: %s', u06.length, romSizeMBit);

    const hasNotAlignedSize = !Number.isInteger(romSizeMBit);
    const hasInvalidSize = !WPC_VALID_ROM_SIZES_IN_MBIT.includes(romSizeMBit);
    if (hasNotAlignedSize || hasInvalidSize) {
      debug('romSizeMBit',romSizeMBit);
      return reject(new Error('INVALID_ROM_SIZE'));
    }

    const soundSystemRom = getSoundBoardSystemRom(u18);

    // Contains the last 32 KiB of Game ROM
    const systemRom = getCpuBoardSystemRom(u06);
    const gameRom = getCpuBoardGameRom(u06);
    const romData = {
      romSizeMBit,
      systemRom,
      gameRom,
      u14,
      u15,
      u18,
      soundSystemRom,
      fileName: metaData.fileName || 'Unknown',
      skipWmcRomCheck: metaData.skipWmcRomCheck === true,
      switchesEnabled: metaData.switchesEnabled || [],
    };
    resolve(romData);
  });
}
