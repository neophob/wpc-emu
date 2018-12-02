'use strict';

const debug = require('debug')('wpcemu:boards:elements:memoryPatchSkipBootCheck');

module.exports = {
  run,
};

// Disable ROM checksum check when booting (U6)
// NOTE: enabling this will make FreeWPC games crash!
function run(memoryPatch) {
  debug('add memorypatch');
  memoryPatch.addPatch(0xFFEC, 0x00);
  memoryPatch.addPatch(0xFFED, 0xFF);
  return memoryPatch;
}
