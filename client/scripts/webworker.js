'use strict';

import WpcEmu from '../../lib/emulator.js';

function initialiseEmulator(romData, gameEntry) {
  const fileName = gameEntry.rom.u06;
  const romObject = {
    fileName,
    skipWpcRomCheck: gameEntry.skipWpcRomCheck,
    features: gameEntry.features,
  };
  return WpcEmu.initVMwithRom(romData, romObject)
    .then((wpcSystem) => {
      console.log('INITIALIZED!');
      wpcSystem.start();
    });
}


onmessage = (event) => {
  postMessage('IN');

  if (event.data.length !== 2) {
    console.error('INVALID_PARAMETER_SIZE');
    return;
  }

  const message = event.data[0];
  const parameter = event.data[1];
  console.log(`[From Main]: ${message} - ${parameter}`);

  switch (message) {
    case 'initialiseEmulator':
      console.log('initialiseEmulator');
      initialiseEmulator(parameter.romData, parameter.gameEntry);
      break;

    default:
      postMessage({ message: 'error', parameter: 'invalid message: ' + message });
  }

};



