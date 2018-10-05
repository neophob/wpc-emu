'use strict';

const debug = require('debug')('wpcemu:boards:elements:memoryPatchGameId');

module.exports = {
  run,
};

const MEDIEVALMADNESS_GAMEID_LO = 20;
const MEDIEVALMADNESS_GAMEID_HI = 99;

function run(memoryPatch, gameIdMemoryPosition) {
  debug('add memorypatch', gameIdMemoryPosition);
  memoryPatch.addPatch(gameIdMemoryPosition, MEDIEVALMADNESS_GAMEID_LO);
  memoryPatch.addPatch(gameIdMemoryPosition + 1, MEDIEVALMADNESS_GAMEID_HI);
  return memoryPatch;
}
