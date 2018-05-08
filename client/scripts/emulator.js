'use strict';

/* global WpcEmu */

export { initialiseEmulator };

function initialiseEmulator(romData, name = 'unknown') {
  return WpcEmu.initVMwithRom(romData, name);
}
