'use strict';

const debug = require('debug')('wpcemu:rom:gameId');

/**
 *  see http://www.edcheung.com/album/album07/Pinball/wpc_sound2.htm
 *  The ROM is searched sequentially for "EC 9F xx yy 83 12 34".  This is a
 *  pattern that marks the address of a pointer to the location of the game ID.
 *  at this location there is a 2 byte number which is the game id
 *  NOTE: this works only for WPC games but NOT for FreeWPC games!
 */

const MAGIC_SEQUENCE_LENGTH = 7;

const PREFIX_MAGIC_1 = 0xEC;
const PREFIX_MAGIC_2 = 0x9F;
const POSTFIX_MAGIC_1 = 0x83;
const POSTFIX_MAGIC_2 = 0x12;
const POSTFIX_MAGIC_3 = 0x34;

module.exports = {
  search,
};

/**
 * gameRom is the ROM file without the last 32kb (the systemRom)
 * systemRom is the bootable ROM (APPLE OS)
 */
function search(gameRom, systemRom) {
  debug('SEARCH GAME ID IN ROM');
  let foundGameIdLink = 0;
  for (let x = 0; x < gameRom.length - MAGIC_SEQUENCE_LENGTH; x++) {
    const prefixMatches = gameRom[x] === PREFIX_MAGIC_1 && gameRom[x + 1] === PREFIX_MAGIC_2;
    if (prefixMatches) {
      const suffixMatches = gameRom[x + 4] === POSTFIX_MAGIC_1 &&
        gameRom[x + 5] === POSTFIX_MAGIC_2 &&
        gameRom[x + 6] === POSTFIX_MAGIC_3;
      if (suffixMatches && ++foundGameIdLink === 2) {
        let gameIdMemoryPosition = (gameRom[x + 2] << 8) + gameRom[x + 3];
        gameIdMemoryPosition -= 0x8000;
        const gameIdMemoryLocation = (systemRom[gameIdMemoryPosition] << 8) + systemRom[gameIdMemoryPosition + 1];
        debug('GAMEID_FOUND', gameIdMemoryLocation);
        console.log('GAMEID_FOUND', gameIdMemoryLocation);
        return gameIdMemoryLocation;
      }
    }
  }
}
