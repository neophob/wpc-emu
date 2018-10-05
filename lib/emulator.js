'use strict';

const debugInstance = require('debug');
const RomHelper = require('./rom/index');
const CpuBoard = require('./boards/cpu-board');

const debug = debugInstance('Emulator');

module.exports = {
  initVMwithRom,
};

class Emulator {
  constructor(romObject) {
    this.cpuBoard = CpuBoard.getInstance(romObject);
  }

  start() {
    debug('Start WPC Emulator');
    this.startTime = Date.now();
    this.cpuBoard.start();
  }

  getUiState() {
    const uiState = this.cpuBoard.getUiState();
    const runtime = Date.now() - this.startTime;
    uiState.opsMs = parseInt(uiState.ticks / runtime, 10);
    uiState.runtime = runtime;
    return uiState;
  }

  registerAudioConsumer(dacCallback) {
    this.cpuBoard.registerDacCallback(dacCallback);
  }

  mixStereo(audioBuffer, sampleCount, offset) {
    /*jshint -W030*/
    () => {
      this.cpuBoard.mixStereo(audioBuffer, sampleCount, offset);
    };
  }

  // MAIN LOOP
  executeCycle(ticksToRun = 500, tickSteps = 4) {
    return this.cpuBoard.executeCycle(ticksToRun, tickSteps);
  }

  setCabinetInput(value) {
    this.cpuBoard.setCabinetInput(value);
  }

  //switch input, TODO rename me
  setInput(value) {
    this.cpuBoard.setInput(value);
  }

  setFliptronicsInput(value) {
    this.cpuBoard.setFliptronicsInput(value);
  }

  reset() {
    debug('RESET!');
    this.startTime = Date.now();
    this.cpuBoard.reset();
  }

}

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT_EXCEPTION', { error: err.message });
});

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED_REJECTION', { msg: error.message, stack: error.stack });
});

/**
 * init emu
 * metadata example:
 * {
 *   features: ["securityPic"]
 *   fileName: "harr_lx2.rom"
 *   skipWmcRomCheck: true
 *   switchesEnabled: undefined
 * }
 */
function initVMwithRom(romObject, metaData) {
  debug('initVMwithRom', Object.keys(romObject), metaData);
  return RomHelper.parse(romObject, metaData)
    .then((romObject) => {
      debug('loading rom succesfull');
      return new Emulator(romObject);
    });
}
