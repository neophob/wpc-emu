'use strict';

import '../node_modules/milligram/dist/milligram.css';
import '../styles/client.css';

import { downloadFileFromUrlAsUInt8Array } from './lib/fetcher';
import { initialiseEmulator } from './lib/emulator';
import { initialiseActions } from './lib/initialise';
import * as gamelist from './db/gamelist';
import { populateControlUiView } from './ui/control-ui';
import * as emuDebugUi from './ui/emu-debug-ui';

const HZ = 2000000;
const DESIRED_FPS = 58;
const TICKS_PER_STEP = parseInt(HZ / DESIRED_FPS, 10);

var wpcSystem;
var intervalId;
var perfTicksExecuted = 0;
var opsMs = 0;

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
        resumeEmu
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

//called at 60hz -> 16.6ms
function step() {
  const perfTs = Date.now();
  perfTicksExecuted = wpcSystem.executeCycle(TICKS_PER_STEP, 10);
  const perfDurationMs = Date.now() - perfTs;
  opsMs = parseInt(perfTicksExecuted / perfDurationMs, 16);
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
