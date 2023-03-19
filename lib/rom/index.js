const debug = require('debug')('wpcemu:rom:loader');
const gameId = require('./game-id');

const WPC_ROM_SIZE_1MBIT = 128 * 1024;
const WPC_VALID_ROM_SIZES_IN_MBIT = [1, 2, 4, 8];
const SYSTEM_ROM_SIZE_BYTES = 32 * 1024;
const SYSTEM_ROM_CHECKSUM_CORRECTION_OFFSET = 0x7FEC;

const PRE_DCS_SOUNDBOARD = [ 'wpcDmd', 'wpcFliptronics' ];

module.exports = {
  parse,
};

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

    debug('LOAD_GAME_ROM');
    const u06 = uInt8Roms.u06;
    const romSizeMBit = u06.length / WPC_ROM_SIZE_1MBIT;
    debug('systemRom (u06) size: %s bytes, mbit size: %s', u06.length, romSizeMBit);

    const hasNotAlignedSize = !Number.isInteger(romSizeMBit);
    const hasInvalidSize = !WPC_VALID_ROM_SIZES_IN_MBIT.includes(romSizeMBit);
    if (hasNotAlignedSize || hasInvalidSize) {
      debug('romSizeMBit',romSizeMBit);
      return reject(new Error('INVALID_ROM_SIZE'));
    }

    // Contains the last 32 KiB of Game ROM
    const systemRom = getCpuBoardSystemRom(u06);
    const gameRom = getCpuBoardGameRom(u06);
    const gameIdMemoryLocation = gameId.search(gameRom, systemRom);
    const hasFeatures = Array.isArray(metaData.features);
    const romData = {
      romSizeMBit,
      systemRom,
      gameRom,
      gameIdMemoryLocation,
      fileName: metaData.fileName || 'Unknown',
      skipWpcRomCheck: metaData.skipWpcRomCheck === true,
      hasSecurityPic: hasFeatures && metaData.features.includes('securityPic'),
      wpc95: hasFeatures && metaData.features.includes('wpc95'),
      hasAlphanumericDisplay: hasFeatures && metaData.features.includes('wpcAlphanumeric'),
      preDcsSoundboard: hasFeatures && (metaData.features.includes(PRE_DCS_SOUNDBOARD[0]) || metaData.features.includes(PRE_DCS_SOUNDBOARD[1])),
      memoryPosition: metaData.memoryPosition,
    };
    resolve(romData);
  });
}
