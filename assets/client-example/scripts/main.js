'use strict';

import * as WpcEmu from 'wpc-emu';

// reference the webworker from wep-emu
import WebWorker from 'worker-loader!./webworker.js';

import { downloadFileFromUrlAsUInt8Array } from './lib/fetcher';
import { initialiseActions } from './lib/initialise';
import { initCanvas, drawDmdShaded } from './lib/canvas';

const DESIRED_FPS = 50;
const INITIAL_GAME = 'WPC-DMD: Hurricane';

let counter = 0;
let rafId;

console.log('INIT WPC-EMU-EXAMPLE');
const wpcEmuWebWorkerApi = WpcEmu.WpcEmuWebWorkerApi.initializeWebworkerAPI(new WebWorker());

initEmuWithGameName(INITIAL_GAME)
  .then(() => registerKeyboardListener())
  .catch((error) => console.error);

/**
 * Bootstrap
 * @param {*} name of game db entry
 * @returns {Promise} which will be resolved once the action is initialized
 */
function initEmuWithGameName(name) {
  const gameEntry = WpcEmu.GamelistDB.getByName(name);
  return downloadFileFromUrlAsUInt8Array(gameEntry.rom.u06)
    .then((u06Rom) => {
      console.log('Successfully loaded ROM', u06Rom.length);
      return wpcEmuWebWorkerApi.initializeEmulator({ u06: u06Rom }, gameEntry);
    })
    .then((emuVersion) => {
      console.log('Successfully initialized emulator', emuVersion);
      return wireEmuToUi();
    })
    .then(resumeEmu)
    // run initial actions on the emu (enable freeplay, set correct switch positions)
    .then(() => initialiseActions(gameEntry.initialise, wpcEmuWebWorkerApi))
    .catch((error) => {
      console.error('FAILED to load ROM:', error.message);
    });
}

/**
 * connect ui elements with emulator
 * @returns {Promise} which is resolved when message is sent
 */
function wireEmuToUi() {
  window.wpcInterface = {
    webclient: wpcEmuWebWorkerApi,
    resetEmu,
    pauseEmu,
    resumeEmu,
    writeMemory,
  };
  initCanvas();

  // register dummy audio callback, will print to console
  wpcEmuWebWorkerApi.registerAudioConsumer((message) => {
    console.log('AUDIO:', message);
  });

  // register ui callback, will be updated once worker send new ui data
  wpcEmuWebWorkerApi.registerUiUpdateConsumer((emuUiState) => canvasMainLoop(emuUiState));

  // configure target FPS of the emu
  return wpcEmuWebWorkerApi.adjustFramerate(DESIRED_FPS);
}

/**
 * main render loop, will be called whenever wpcEmuWebWorkerApi has new data
 * @param {Object} emuUiState the new state
 * @returns {undefined} nada
 */
function canvasMainLoop(emuUiState) {
  const { emuState } = emuUiState;
  if (!emuState) {
    console.log('NO_EMU_STATE!');
    return;
  }

  if (emuState.asic.dmd.dmdShadedBuffer) {
    if (rafId) {
      console.log('MISSED_DRAW!', rafId);
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame((timestamp) => {
      drawDmdShaded(emuState.asic.dmd.dmdShadedBuffer);
      rafId = 0;
    });
  }
  if ((++counter % 240) === 0) {
    console.log('wpcEmuWebWorkerApi.getStatistics()',wpcEmuWebWorkerApi.getStatistics());
  }
}

/**
 * freeze motherfucker!
 * @returns {Promise} which is resolved when message is sent
 */
function pauseEmu() {
  cancelAnimationFrame(rafId);
  rafId = undefined;
  return wpcEmuWebWorkerApi.pauseEmulator();
}

/**
 * resumes the paused WPC Machine
 * @returns {Promise} which is resolved when message is sent
 */
function resumeEmu() {
  return wpcEmuWebWorkerApi.resumeEmulator();
}

/**
 * reboots the WPC Machine
 * @returns {Promise} which is resolved when message is sent
 */
function resetEmu() {
  return wpcEmuWebWorkerApi.resetEmulator();
}

/**
 * Write directly to emulator memory
 * @param {Number} offset where to write
 * @param {Number|String} value String or uint8 value to write
 * @returns {Promise} which is resolved when message is sent
 */
function writeMemory(offset, value) {
  return wpcEmuWebWorkerApi.writeMemory(offset, value);
}

/**
 * register some keyboard shortcuts
 * @returns {undefined} nada
 */
function registerKeyboardListener() {
  window.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case 49: //1
        return wpcEmuWebWorkerApi.setCabinetInput(1);
      case 50: //2
        return wpcEmuWebWorkerApi.setCabinetInput(2);
      case 51: //3
        return wpcEmuWebWorkerApi.setCabinetInput(4);
      case 52: //4
        return wpcEmuWebWorkerApi.setCabinetInput(8);
      case 53: //5
        return wpcEmuWebWorkerApi.setInput(13);
      case 55: //7
        return wpcEmuWebWorkerApi.setCabinetInput(16);
      case 56: //8
        return wpcEmuWebWorkerApi.setCabinetInput(32);
      case 57: //9
        return wpcEmuWebWorkerApi.setCabinetInput(64);
      case 48: //0
        return wpcEmuWebWorkerApi.setCabinetInput(128);
      case 80: //P
        return pauseEmu();
      case 82: //R
        return resumeEmu();
    }
  }, false);
}
