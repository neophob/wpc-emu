'use strict';

/* global WpcEmu */

export { initialiseEmulator };

function initialiseEmulator(romData, gameEntry) {
  const fileName = gameEntry.rom.u06;
  const romObject = {
    fileName,
    skipWmcRomCheck: gameEntry.skipWmcRomCheck,
    switchesEnabled: gameEntry.switchesEnabled,
  };
  return WpcEmu.initVMwithRom(romData, romObject);
}
