'use strict';

const debugInstance = require('debug');
const Package = require('../package.json');
const RomHelper = require('./rom/index');
const CpuBoard = require('./boards/cpu-board');
const UiFacade = require('./boards/ui');

const debug = debugInstance('Emulator');

module.exports = {
  initVMwithRom,
  getVersion,
};

const TICKS_PER_MILLISECOND = 2000;

class Emulator {

  constructor(romObject) {
    this.cpuBoard = CpuBoard.getInstance(romObject);
    this.uiFacade = UiFacade.getInstance(romObject.memoryPosition);
  }

  start() {
    debug('Start WPC Emulator');
    this.startTime = Date.now();
    this.cpuBoard.start();
  }

  getUiState(includeExpensiveData = true) {
    const uiState = this.cpuBoard.getState();
    const asicChangedState = this.uiFacade.getChangedAsicState(uiState.asic, includeExpensiveData);
    uiState.asic = asicChangedState;
    const runtime = Date.now() - this.startTime;
    // TODO should be renamed to averageTicksPerMs
    uiState.opsMs = Number.parseInt(uiState.cpuState.tickCount / runtime, 10);
    uiState.runtime = runtime;
    return uiState;
  }

  getState() {
    return this.cpuBoard.getState();
  }

  setState(stateObject) {
    return this.cpuBoard.setState(stateObject);
  }

  registerAudioConsumer(playbackIdCallback) {
    this.cpuBoard.registerSoundBoardCallback(playbackIdCallback);
  }

  // MAIN LOOP
  executeCycle(ticksToRun = 500, tickSteps = 4) {
    return this.cpuBoard.executeCycle(ticksToRun, tickSteps);
  }

  executeCycleForTime(advanceByMs, tickSteps) {
    const ticksToAdvance = TICKS_PER_MILLISECOND * advanceByMs;
    return this.executeCycle(ticksToAdvance, tickSteps);
  }

  setCabinetInput(value) {
    this.cpuBoard.setCabinetInput(value);
  }

  setSwitchInput(switchNr, optionalValue) {
    this.cpuBoard.setSwitchInput(switchNr, optionalValue);
  }

  setFliptronicsInput(value, optionalValue) {
    this.cpuBoard.setFliptronicsInput(value, optionalValue);
  }

  toggleMidnightMadnessMode() {
    this.cpuBoard.toggleMidnightMadnessMode();
  }

  setDipSwitchByte(dipSwitch) {
    this.cpuBoard.setDipSwitchByte(dipSwitch);
  }

  getDipSwitchByte() {
    return this.cpuBoard.getDipSwitchByte();
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
* Initialize the WPC-EMU
* @function
* @param {Object} romObject, rom data (sound and main game). NOTE: DCS sound roms are not implemented yet
* @param {Object} metaData, meta data about the current game
* @return {promise} promise contains a new Emulator instance.
* @example
*
* const romObject = {
*   u06: Uint8Array(524288),
* };
* const metaData = {
*   features: ['securityPic'], // needed for WPC-S games
*   fileName: 'harr_lx2.rom',
*   skipWpcRomCheck: true,     // speedup bootup for WPC games
*   memoryPosition: [          // information about the game ram state (optional)
*    { offset: 0x3B2, description: 'current player', type: 'uint8' }
*   ]
* };
* wpcEmu.initVMwithRom(romObject, metaData)
*   .then((emu) => {
*     ...
*   }
*/
function initVMwithRom(romObject, metaData) {
  debug('initVMwithRom', Object.keys(romObject), metaData);
  return RomHelper.parse(romObject, metaData)
    .then((romObject) => {
      debug('loading rom successful');
      return new Emulator(romObject);
    });
}

function getVersion() {
  return Package.version;
}
