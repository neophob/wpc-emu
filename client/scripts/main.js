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

const HZ = 2000000;
const DESIRED_FPS = 58;
const TICKS_PER_STEP = parseInt(HZ / DESIRED_FPS, 10);

const AudioContext = window.AudioContext || window.webkitAudioContext;
const soundInstance = AudioOutput(AudioContext);

var wpcSystem;
var intervalId;
var perfTicksExecuted = 0;

function initialiseEmu(gameEntry) {
  return downloadFileFromUrlAsUInt8Array(gameEntry.url)
    .then((romData) => {
      return initialiseEmulator(romData, gameEntry);
    })
    .then((_wpcSystem) => {
      wpcSystem = _wpcSystem;
      // TODO IIKS we pollute globals here
      window.wpcInterface = {
        wpcSystem,
        pauseEmu,
        resumeEmu,
        romSelection
      };
      console.log('Successully loaded ROM');
      wpcSystem.start();
      console.log('Successully started EMU');
      return emuDebugUi.initialise();
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
  populateControlUiView(gameEntry);
  return initialiseEmu(gameEntry)
    .then(() => {
      resumeEmu();
      return initialiseActions(gameEntry.initialise, wpcSystem);
    });
}

initEmuWithGameName('Hurricane');


window.onerror = function(errorMsg, url, lineNumber) {
  console.error('error', lineNumber, errorMsg);
};

//called at 60hz -> 16.6ms
function step() {
  perfTicksExecuted = wpcSystem.executeCycle(TICKS_PER_STEP, 16);
  const emuState = wpcSystem.getUiState();
  const cpuState = intervalId ? 'running' : 'paused';
  emuDebugUi.updateCanvas(emuState, cpuState);
  intervalId = requestAnimationFrame(step);
}

function resumeEmu() {
  console.log('client start emu');
  intervalId = requestAnimationFrame(step);
}

function pauseEmu() {
  console.log('stop emu');
  cancelAnimationFrame(intervalId);
  intervalId = false;
  emuDebugUi.updateCanvas();
}
