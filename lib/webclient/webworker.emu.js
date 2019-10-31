const WpcEmu = require('../emulator');
const MESSAGE = require('./messaging/message');

module.exports = {
  buildWpcInstance,
};

const TICKS_PER_SECOND = 2000000;
const TICKS_PER_MILLISECOND = 2000;
const TICKS_PER_STEP = 16;
const INITIAL_FRAMERATE = 5;

/**
 * initialize a new wpc emu instance
 * call will be rejected if provided rom is invalid
 * @param {*} romData
 * @param {*} gameEntry
 */
function buildWpcInstance(romData, gameEntry) {
  if (!romData || !romData.u06 || !gameEntry || !gameEntry.rom) {
    return Promise.reject(new Error('INVALID_PARAMETER'));
  }
  const fileName = gameEntry.rom.u06;
  const romObject = {
    fileName,
    skipWpcRomCheck: gameEntry.skipWpcRomCheck,
    features: gameEntry.features,
    memoryPosition: gameEntry.memoryPosition,
  };
  return WpcEmu.initVMwithRom(romData, romObject)
    .then((wpcSystem) => {
      console.log('EMU INITIALIZED!');
      return new Emu(wpcSystem);
    });
}

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
    return this.emuInstance.getState();
  }

  setEmulatorState(emuState) {
    return this.emuInstance.setState(emuState);
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

  writeMemory(offset, value) {
    this.emuInstance.cpuBoard.modifyMemory(offset, value);
  }

  emuStepByTime(advanceByMs) {
    const ticksToAdvance = TICKS_PER_MILLISECOND * advanceByMs;
    this.emuInstance.executeCycle(ticksToAdvance, TICKS_PER_STEP);
  }
}

