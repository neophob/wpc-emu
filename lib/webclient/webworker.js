'use strict';

import WpcEmu from '../../lib/emulator';

const MESSAGE = require('./messaging/message');

let emu;

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
      emu = new Emu(wpcSystem);
    });
}

onmessage = (event) => {
  if (event.data.length !== 3) {
    console.error('INVALID_PARAMETER_SIZE');
    postMessage({ message: MESSAGE.ERROR, parameter: 'invalid parameter size' });
    return;
  }

  postMessage('IN', event);

  const requestId = event.data[0];
  const message = event.data[1];
  const parameter = event.data[2];

  console.log(`[From Main]: ${requestId} - ${message} - ${parameter}`);

  switch (message) {
    case MESSAGE.initialiseEmulator:
      initialiseEmulator(parameter.romData, parameter.gameEntry)
        .then(() => {
          emu.start();
          postMessage({ message: MESSAGE.ACK, requestId });
        });
      break;

    case MESSAGE.pauseEmulator:
      //TODO implement
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.resumeEmulator:
      //TODO implement
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.resetEmulator:
      //TODO validate if emu is defined
      emu.reset();
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    default:
      postMessage({ message: MESSAGE.ERROR, requestId, parameter: 'invalid message: ' + message });
  }
};

class Emu {

  constructor(emuInstance) {
    this.emuInstance = emuInstance;
  }

  getVersion() {
    return this.emuInstance.version();
  }

  start() {
    this.emuInstance.start();
  }

  reset() {
    this.emuInstance.reset();
  }

  setCabinetInput(key) {
    this.emuInstance.setCabinetInput(key);
  }

  setInput(key) {
    this.emuInstance.setInput(key);
  }

  executeCycle(key) {
    //this.emuInstance.executeCycle(TICKS_PER_CALL, TICKS_PER_STEP);
  }

}

