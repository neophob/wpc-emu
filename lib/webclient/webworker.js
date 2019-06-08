'use strict';

import WpcEmu from '../emulator';

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

  console.log('IN', event);

  const requestId = event.data[0];
  const message = event.data[1];
  const parameter = event.data[2];

  console.log(`[From Main]: ${requestId} - ${message} - ${parameter}`);

  if (message === MESSAGE.initialiseEmulator) {
    return initialiseEmulator(parameter.romData, parameter.gameEntry)
      .then(() => {
        emu.start();
        postMessage({ message: MESSAGE.ACK, requestId });
      });
  }

  if (!emu) {
    postMessage({ message: MESSAGE.ERROR, requestId, parameter: 'EMU_NOT_INITIALIZED' });
    return;
  }

  switch (message) {
    case MESSAGE.pauseEmulator:
      //TODO implement
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.resumeEmulator:
      //TODO implement
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.resetEmulator:
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

  start() {
    this.emuInstance.start();
  }

  getUiState() {
    return this.emuInstance.getUiState();
  }

  registerAudioConsumer(playbackIdCallback) {
    this.emuInstance.registerAudioConsumer(playbackIdCallback);
  }

  executeCycle(ticksToRun = 500, tickSteps = 4) {
    return this.emuInstance.executeCycle(ticksToRun, tickSteps);
  }

  setCabinetInput(value) {
    this.emuInstance.setCabinetInput(value);
  }

  setInput(value) {
    this.emuInstance.setInput(value);
  }

  setFliptronicsInput(value) {
    this.emuInstance.setFliptronicsInput(value);
  }

  toggleMidnightMadnessMode() {
    this.emuInstance.toggleMidnightMadnessMode();
  }

  reset() {
    this.emuInstance.reset();
  }

  getVersion() {
    return this.emuInstance.version();
  }

}

