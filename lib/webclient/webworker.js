'use strict';

const WpcEmu = require('../emulator');
const MESSAGE = require('./messaging/message');

module.exports = {
  initialiseEmulator,
};

const TICKS_PER_SECOND = 2000000;
const TICKS_PER_STEP = 16;
const INITIAL_FRAMERATE = 5;

let emu;
let emuState;

function initialiseEmulator(romData, gameEntry) {
  const fileName = gameEntry.rom.u06;
  const romObject = {
    fileName,
    skipWpcRomCheck: gameEntry.skipWpcRomCheck,
    features: gameEntry.features,
  };
  return WpcEmu.initVMwithRom(romData, romObject)
    .then((wpcSystem) => {
      if (emu) {
        emu.stop();
      }
      console.log('INITIALIZED!');
      emu = new Emu(wpcSystem);
    });
}

onmessage = (event) => {
  if (!event.data || event.data.length < 2) {
    console.error('INVALID_PARAMETER_SIZE');
    postMessage({ message: MESSAGE.MSG_TYPE_ERROR, parameter: 'INVALID_PARAMETER_SIZE' });
    return;
  }
  const requestId = event.data[0];
  const message = event.data[1];
  const parameter = event.data[2];

  if (message === MESSAGE.initialiseEmulator) {
    return initialiseEmulator(parameter.romData, parameter.gameEntry)
      .then(() => {
        emu.start();
        postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      });
  }

  if (!emu) {
    postMessage({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'EMU_NOT_INITIALIZED' });
    return;
  }

  switch (message) {

    case MESSAGE.resetEmulator:
      emu.reset();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.setCabinetInput:
      if (!Number.isInteger(parameter)) {
        return postMessage({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'INVALID_CABINET_INPUT_PARAMETER_' + parameter });
      }
      emu.setCabinetInput(parameter);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.setInput:
      emu.setInput(parameter);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.setFliptronicsInput:
      emu.setFliptronicsInput(parameter);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.toggleMidnightMadnessMode:
      emu.toggleMidnightMadnessMode();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.getVersion: {
      const version = emu.getVersion();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId, parameter: version });
      break;
    }

    case MESSAGE.getEmulatorRomName: {
      const romName = emu.getEmulatorRomName();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId, parameter: romName });
      break;
    }

    case MESSAGE.getEmulatorState: {
      const state = emu.getEmulatorState();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId, parameter: state });
      break;
    }

    case MESSAGE.setEmulatorState:
      emu.setEmulatorState(parameter);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.registerAudioConsumer:
      emu.registerAudioConsumer((sampleId) => {
        postMessage({ message: MESSAGE.MSG_TYPE_AUDIO_CALLBACK, sampleId });
      });
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.getNextFrame:
      if (!emuState) {
        return postMessage({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'NEXT_FRAME_NOT_READY' });
      }
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId, parameter: { emuState } });
      emuState = undefined;
      break;

    case MESSAGE.configureFrameRate:
      emu.configureFramerate(parameter);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.pauseEmulator:
      emu.pause();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.resumeEmulator:
      emu.resume();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.writeMemory:
      emu.writeMemory(parameter, event.data[3], event.data[4]);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    default:
      return postMessage({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'UNKNOWN_MESSAGE_' + message });
  }
};

class Emu {

  constructor(emuInstance) {
    this.emuInstance = emuInstance;
    this.intervalId = 0;
    this.desiredFrameRate = INITIAL_FRAMERATE;
    this.ticksPerCall = parseInt(TICKS_PER_SECOND / this.desiredFrameRate, 10);
  }

  configureFramerate(frameRate) {
    if (frameRate < 1 || frameRate > 200) {
      console.error('INVALID_FRAMERATE_IGNORED', frameRate);
      return;
    }
    this.desiredFrameRate = frameRate;
    console.log('desiredFrameRate:', this.desiredFrameRate);
    this.ticksPerCall = parseInt(TICKS_PER_SECOND / this.desiredFrameRate, 10);
    if (this.intervalId) {
      this.resume();
    }
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

  getEmulatorRomName() {
    return this.emuInstance.cpuBoard.romFileName;
  }

  getEmulatorState() {
    return this.emuInstance.cpuBoard.getState();
  }

  setEmulatorState(emuState) {
    return this.emuInstance.cpuBoard.setState(emuState);
  }

  _emuStep() {
    this.emuInstance.executeCycle(this.ticksPerCall, TICKS_PER_STEP);
    const emuState = this.emuInstance.getUiState();
    const parameter = {
      emuState,
    };
    postMessage({ message: MESSAGE.MSG_TYPE_UIDATA, parameter });
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = false;
  }

  pause() {
    if (!this.intervalId) {
      // allows step by step
      this._emuStep();
    }

    const parameter = {
      emuState: this.emuInstance.getUiState(),
    };
    postMessage({ message: MESSAGE.MSG_TYPE_UIDATA, parameter });
    this.stop();
  }

  resume() {
    if (this.intervalId) {
      this.pause();
    }

    const intervalTimingMs = 1000 / this.desiredFrameRate;
    console.log('resume emu', intervalTimingMs);
    this.intervalId = setInterval(() => {
      this._emuStep();
    }, intervalTimingMs);
  }

  writeMemory(offset, value, block) {
    this.emuInstance.cpuBoard.modifyMemory(offset, value, block);
  }
}

