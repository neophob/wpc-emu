'use strict';

const debug = require('debug')('wpcemu:rom:loader');

const WPC_ROM_SIZE_1MBIT = 128 * 1024;
const WPC_VALID_ROM_SIZES_IN_MBIT = [1,2,4,8];
const SYSTEM_ROM_SIZE_BYTES = 32 * 1024;
const SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET = 0x7FEC;
const SOUNDBOARD_SYSTEM_ROM_SIZE = 0x4000;
const SOUNDBOARD_CONCATINATED_ROM_SIZE = 0x180000;

module.exports = {
  parse,
};

function getSoundBoardSystemRom(uInt8Roms) {
  const u18Rom = uInt8Roms.u18;
  return u18Rom.subarray(u18Rom.length - SOUNDBOARD_SYSTEM_ROM_SIZE, u18Rom.length);
}

/*
  Layout:
    u18: 0x000000
    u15: 0x080000
    u14: 0x100000
*/
function getConcatinatedSoundRoms(uInt8Roms) {
  const soundRom = new Uint8Array(SOUNDBOARD_CONCATINATED_ROM_SIZE);
  soundRom.set(uInt8Roms.u18, 0);
  debug('u18 rom size: %s bytes', uInt8Roms.u18.length);

  if (uInt8Roms.u15) {
    soundRom.set(uInt8Roms.u15, 0x080000);
    debug('u15 rom size: %s bytes', uInt8Roms.u15.length);
  }
  if (uInt8Roms.u14) {
    soundRom.set(uInt8Roms.u14, 0x100000);
    debug('u14 rom size: %s bytes', uInt8Roms.u14.length);
  }
  return soundRom;
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

function parse(uInt8Roms, metaData = {}) {
  return new Promise((resolve, reject) => {
    if (typeof uInt8Roms !== 'object') {
      return reject(new Error('INVALID_ROM_DATA'));
    }

    debug('LOAD_GAME_ROM_AND_SOUND_ROM');
    const u06 = uInt8Roms.u06;
    const romSizeMBit = u06.length / WPC_ROM_SIZE_1MBIT;
    debug('systemRom (u06) size: %s bytes, mbit size: %s', u06.length, romSizeMBit);

    const hasNotAlignedSize = !Number.isInteger(romSizeMBit);
    const hasInvalidSize = !WPC_VALID_ROM_SIZES_IN_MBIT.includes(romSizeMBit);
    if (hasNotAlignedSize || hasInvalidSize) {
      debug('romSizeMBit',romSizeMBit);
      return reject(new Error('INVALID_ROM_SIZE'));
    }

    const concatinatedSoundRom = getConcatinatedSoundRoms(uInt8Roms);
    const soundSystemRom = getSoundBoardSystemRom(uInt8Roms);

    // Contains the last 32 KiB of Game ROM
    const systemRom = getCpuBoardSystemRom(u06);
    const gameRom = getCpuBoardGameRom(u06);
    const romData = {
      romSizeMBit,
      systemRom,
      gameRom,
      soundSystemRom,
      concatinatedSoundRom,
      fileName: metaData.fileName || 'Unknown',
      skipWmcRomCheck: metaData.skipWmcRomCheck === true,
      switchesEnabled: metaData.switchesEnabled || [],
    };
    resolve(romData);
  });
}
