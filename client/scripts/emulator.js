'use strict';

/* global WpcEmu */

export { initialiseEmulator };

function initialiseEmulator(romData, gameEntry) {
  const romUrl = gameEntry.url;
  const fileName = romUrl.substring(romUrl.lastIndexOf('/') + 1);
  const romObject = {
    fileName,
    skipWmcRomCheck: gameEntry.skipWmcRomCheck,
    switchesEnabled: gameEntry.switchesEnabled,
  };
  return WpcEmu.initVMwithRom(romData, romObject);
}
