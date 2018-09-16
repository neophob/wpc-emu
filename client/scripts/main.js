'use strict';

import '../node_modules/milligram/dist/milligram.css';
import '../styles/client.css';

import { downloadFileFromUrlAsUInt8Array } from './lib/fetcher';
import { initialiseEmulator } from './lib/emulator';
import { initialiseActions } from './lib/initialise';
import { AudioOutput } from './lib/sound';
import * as gamelist from './db/gamelist';
import { populateControlUiView } from './ui/control-ui';
import * as emuDebugUi from './ui/emu-debug-ui';

const TICKS = 2000000;
const DESIRED_FPS = 58;
const TICKS_PER_STEP = parseInt(TICKS / DESIRED_FPS, 10);

const AudioContext = window.AudioContext || window.webkitAudioContext;
const soundInstance = AudioOutput(AudioContext);

var wpcSystem;
var intervalId;
var perfTicksExecuted = 0;

function dacCallback(value) {
  soundInstance.writeAudioData(value);
}

function initialiseEmu(gameEntry) {
  const u06Promise = downloadFileFromUrlAsUInt8Array(gameEntry.rom.u06);
  const u14Promise = downloadFileFromUrlAsUInt8Array(gameEntry.rom.u14).catch(() => []);
  const u15Promise = downloadFileFromUrlAsUInt8Array(gameEntry.rom.u15).catch(() => []);
  const u18Promise = downloadFileFromUrlAsUInt8Array(gameEntry.rom.u18);

  return Promise.all([
      u06Promise,
      u14Promise,
      u15Promise,
      u18Promise,
    ])
    .then((romFiles) => {
      console.log('Successully loaded ROM');
      const romData = {
        u06: romFiles[0],
        u14: romFiles[1],
        u15: romFiles[2],
        u18: romFiles[3],
      };
      return initialiseEmulator(romData, gameEntry);
    })
    .then((_wpcSystem) => {
      console.log('Successully initialised emulator');
      wpcSystem = _wpcSystem;
      // TODO IIKS we pollute globals here
      window.wpcInterface = {
        wpcSystem,
        pauseEmu,
        resumeEmu,
        romSelection
      };
      wpcSystem.start();
      wpcSystem.registerAudioConsumer(dacCallback);
      soundInstance.setMixStereoFunction(wpcSystem.mixStereo);
      console.log('Successully started EMU');
      return emuDebugUi.initialise(gameEntry);
    })
    .catch((error) => {
      console.error('FAILED to load ROM:', error.message);
    });
}

function romSelection(romName) {
  initEmuWithGameName(romName);
}

function initEmuWithGameName(name) {
  const gameEntry = gamelist.getByName(name);
  populateControlUiView(gameEntry, gamelist);
  return initialiseEmu(gameEntry)
    .then(() => {
      resumeEmu();
      return initialiseActions(gameEntry.initialise, wpcSystem);
    });
}

initEmuWithGameName('Hurricane');

//called at 60hz -> 16.6ms
function step() {
  perfTicksExecuted = wpcSystem.executeCycle(TICKS_PER_STEP, 16);
  const emuState = wpcSystem.getUiState();
  const cpuState = intervalId ? 'running' : 'paused';
  emuDebugUi.updateCanvas(emuState, cpuState);
  intervalId = requestAnimationFrame(step);
}

function resumeEmu() {
  if (intervalId) {
    return;
  }
  console.log('client start emu');
  intervalId = requestAnimationFrame(step);
}

function pauseEmu() {
  console.log('stop emu');
  cancelAnimationFrame(intervalId);
  intervalId = false;
  emuDebugUi.updateCanvas(wpcSystem.getUiState(), 'paused');
}
