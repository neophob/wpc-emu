'use strict';

const debug = require('debug')('wpcemu:rom:loader');
const gameId = require('./game-id');

const WPC_ROM_SIZE_1MBIT = 128 * 1024;
const WPC_VALID_ROM_SIZES_IN_MBIT = [1, 2, 4, 8];
const SYSTEM_ROM_SIZE_BYTES = 32 * 1024;
const SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET = 0x7FEC;
const SOUNDBOARD_SYSTEM_ROM_SIZE = 0x4000;

const MAXIMAL_SOUND_ROM_SIZE = 0x80000;
const SOUNDBOARD_CONCATENATED_ROM_SIZE = MAXIMAL_SOUND_ROM_SIZE * 3;

module.exports = {
  parse,
};

function getSoundBoardSystemRom(uInt8Roms) {
  const u18Rom = uInt8Roms.u18;
  if (!u18Rom) {
    return;
  }
  return u18Rom.subarray(u18Rom.length - SOUNDBOARD_SYSTEM_ROM_SIZE, u18Rom.length);
}

/*
  Concatined ROM Layout:
    u18: 0x000000 - content of U18 ROM
         0x078000 - System ROM (16KB) - not sure if correct
         0x07C000 - System ROM (16KB)
    u15: 0x080000 - content of U15 ROM (optional)
    u14: 0x100000 - content of U14 ROM (optional)
*/
function getConcatenatedSoundRoms(uInt8Roms) {
  if (!uInt8Roms.u18 || uInt8Roms.u18.length === 0 ||
    !uInt8Roms.u15 || !uInt8Roms.u14) {
    console.log('missing sound roms');
    return;
  }
  const ROM_OFFSET = 0x80000;
  const soundRom = new Uint8Array(SOUNDBOARD_CONCATENATED_ROM_SIZE).fill(0);
  console.log('u18 rom size: %s bytes', uInt8Roms.u18.length);
  if (uInt8Roms.u18.length > ROM_OFFSET) {
    throw new Error('U18_ROM_SIZE_EXCEEDED');
  }
  soundRom.set(uInt8Roms.u18, 0);

  if (uInt8Roms.u15) {
    console.log('u15 rom size: %s bytes', uInt8Roms.u15.length);
    if (uInt8Roms.u15.length > ROM_OFFSET) {
      throw new Error('U15_ROM_SIZE_EXCEEDED');
    }
    soundRom.set(uInt8Roms.u15, ROM_OFFSET);
  }
  if (uInt8Roms.u14) {
    console.log('u14 rom size: %s bytes', uInt8Roms.u14.length);
    if (uInt8Roms.u14.length > ROM_OFFSET) {
      throw new Error('U14_ROM_SIZE_EXCEEDED');
    }
    soundRom.set(uInt8Roms.u14, ROM_OFFSET * 2);
  }

  //copy systemrom to page 15 (15 x 32kb = 0x78000)
  const systemRom = getSoundBoardSystemRom(uInt8Roms);
  //soundRom.set(systemRom, 0x78000);
  soundRom.set(systemRom, 0x7C000);
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

    const concatenatedSoundRom = getConcatenatedSoundRoms(uInt8Roms);
    const soundSystemRom = getSoundBoardSystemRom(uInt8Roms);

    // Contains the last 32 KiB of Game ROM
    const systemRom = getCpuBoardSystemRom(u06);
    const gameRom = getCpuBoardGameRom(u06);
    const gameIdMemoryLocation = gameId.search(gameRom, systemRom);
    const hasFeatures = Array.isArray(metaData.features);
    const romData = {
      romSizeMBit,
      systemRom,
      gameRom,
      soundSystemRom,
      concatenatedSoundRom,
      gameIdMemoryLocation,
      fileName: metaData.fileName || 'Unknown',
      skipWmcRomCheck: metaData.skipWmcRomCheck === true,
      hasSecurityPic: hasFeatures && metaData.features.includes('securityPic'),
    };
    resolve(romData);
  });
}
