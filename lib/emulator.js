'use strict';

const debugInstance = require('debug');
const Package = require('../package.json');
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

  version() {
    return Package.version;
  }
}

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT_EXCEPTION', { error: err.message });
});

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED_REJECTION', { msg: error.message, stack: error.stack });
});

/**
* Initialise the WPC-EMU
* @function
* @param {Object} romObject, rom data (sound and main game). NOTE: DCS sound roms are not implemented yet
* @param {Object} metaData, meta data about the current game
* @return {promise} promise contains a new Emulator instance.
* @example
*
* const romObject = {
*   u06: Uint8Array(524288),
*   u14: Uint8Array(131072),
*   u15: Uint8Array(131072),
*   u18: Uint8Array(131072),
* };
* const metaData = {
*   features: ["securityPic"], // needed for WPC-S games
*   fileName: "harr_lx2.rom",
*   skipWmcRomCheck: true,     // speedup bootup for WPC games
* };
* wpcEmu.initVMwithRom(romObject, metaData)
   .then((emu) => {
     ...
   }
*/
function initVMwithRom(romObject, metaData) {
  debug('initVMwithRom', Object.keys(romObject), metaData);
  return RomHelper.parse(romObject, metaData)
    .then((romObject) => {
      debug('loading rom successful');
      return new Emulator(romObject);
    });
}
