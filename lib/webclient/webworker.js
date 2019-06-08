'use strict';

const WpcEmu = require('../emulator');

const MESSAGE = require('./messaging/message');

const TICKS = 2000000;
const DESIRED_FPS = 58;
const TICKS_PER_CALL = parseInt(TICKS / DESIRED_FPS, 10);
const TICKS_PER_STEP = 16;
let emu;

module.exports = {
  initialiseEmulator,
};

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
  if (event.data.length < 2) {
    console.error('INVALID_PARAMETER_SIZE');
    postMessage({ message: MESSAGE.ERROR, parameter: 'invalid parameter size' });
    return;
  }

  console.log('>>IN', event);

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
      emu.pause();
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.resumeEmulator:
      emu.resume();
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.resetEmulator:
      emu.reset();
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.setCabinetInput:
      //TODO Number.isInteger gets junked by webpack
      if (!(parameter)) {
        return postMessage({ message: MESSAGE.ERROR, requestId, parameter: 'INVALID_PARAMETER' });
      }
      emu.setCabinetInput(parameter);
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.setInput:
      //TODO Number.isInteger gets junked by webpack
      if (!(parameter)) {
        return postMessage({ message: MESSAGE.ERROR, requestId, parameter: 'INVALID_PARAMETER' });
      }
      emu.setInput(parameter);
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.setFliptronicsInput:
      //TODO Number.isInteger gets junked by webpack
      if (!(parameter)) {
        return postMessage({ message: MESSAGE.ERROR, requestId, parameter: 'INVALID_PARAMETER' });
      }
      emu.setFliptronicsInput(parameter);
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.toggleMidnightMadnessMode:
      emu.toggleMidnightMadnessMode();
      postMessage({ message: MESSAGE.ACK, requestId });
      break;

    case MESSAGE.getVersion:
      const version = emu.getVersion();
      postMessage({ message: MESSAGE.ACK, requestId, parameter: version });
      break;

    default:
      return postMessage({ message: MESSAGE.ERROR, requestId, parameter: 'UNKNOWN_MESSAGE_' + message });
  }
};

class Emu {

  constructor(emuInstance) {
    this.emuInstance = emuInstance;
    this.intervalId = 0;
  }

  start() {
    this.emuInstance.start();
    this.intervalId = requestAnimationFrame(() => { this._emuStep() });
  }

  _emuStep() {
    this.emuInstance.executeCycle(TICKS_PER_CALL, TICKS_PER_STEP);
    this.emuState = this.emuInstance.getUiState();
    this.intervalId = requestAnimationFrame(() => { this._emuStep() });
  }

  pause() {
    console.log('stop emu');
/*    if (wpcSystem) {
      const audioState = soundInstance.getState();
      emuDebugUi.updateCanvas(wpcSystem.getUiState(), 'paused', audioState);
    }*/

    //soundInstance.pause();

    if (!this.intervalId) {
      // allows step by step
      this._emuStep();
    }

    cancelAnimationFrame(this.intervalId);
    this.intervalId = false;
  }

  resume() {
    if (this.intervalId) {
      this.pause();
    }
    console.log('resume emu');
    //soundInstance.resume();

    this.intervalId = requestAnimationFrame(() => { this._emuStep() });
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

