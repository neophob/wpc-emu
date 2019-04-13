'use strict';

/* global WpcEmu */

export { initialiseEmulator };

function initialiseEmulator(romData, gameEntry) {
  const fileName = gameEntry.rom.u06;
  const romObject = {
    fileName,
    skipWpcRomCheck: gameEntry.skipWpcRomCheck,
    features: gameEntry.features,
  };
  return WpcEmu.initVMwithRom(romData, romObject);
}
