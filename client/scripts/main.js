'use strict';

import '../node_modules/milligram/dist/milligram.css';
import '../styles/client.css';

import { downloadFileFromUrlAsUInt8Array } from './lib/fetcher';
import { initialiseEmulator } from './lib/emulator';
import { initialiseActions } from './lib/initialise';
import { loadRam, saveRam, } from './lib/ramState';
import { initialise as initDmdExport, save as saveFile } from './lib/pin2DmdExport';
import { AudioOutput } from './lib/sound';
import * as gamelist from './db/gamelist';
import { populateControlUiView } from './ui/control-ui';
import * as emuDebugUi from './ui/emu-debug-ui';

const TICKS = 2000000;
const DESIRED_FPS = 58;
const TICKS_PER_CALL = parseInt(TICKS / DESIRED_FPS, 10);
const TICKS_PER_STEP = 16;
const INITIAL_GAME = 'WPC-DMD: Hurricane';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const soundInstance = AudioOutput(AudioContext);

var wpcSystem;
var intervalId;
var dmdDump = initDmdExport();

function dacCallback(value) {
  soundInstance.writeAudioData(value);
}

function initialiseEmu(gameEntry) {
  const u06Promise = downloadFileFromUrlAsUInt8Array(gameEntry.rom.u06);
  const u14Promise = downloadFileFromUrlAsUInt8Array(gameEntry.rom.u14).catch(() => {});
  const u15Promise = downloadFileFromUrlAsUInt8Array(gameEntry.rom.u15).catch(() => {});
  const u18Promise = downloadFileFromUrlAsUInt8Array(gameEntry.rom.u18).catch(() => {});

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
      console.log('Successfully initialised emulator');
      const selectElementRoot = document.getElementById('wpc-release-info');
      selectElementRoot.innerHTML = 'WPC-Emu v' + _wpcSystem.version();

      wpcSystem = _wpcSystem;
      // TODO IIKS we pollute globals here
      window.wpcInterface = {
        wpcSystem,
        pauseEmu,
        resumeEmu,
        romSelection,
        saveState,
        loadState,
      };
      wpcSystem.registerAudioConsumer(dacCallback);
      wpcSystem.start();
      soundInstance.setMixStereoFunction(wpcSystem.mixStereo);
      console.log('Successully started EMU v' + wpcSystem.version());
      return emuDebugUi.initialise(gameEntry);
    })
    .catch((error) => {
      console.error('FAILED to load ROM:', error.message);
      console.log(error.stack);
    });
}

function saveState() {
  pauseEmu();
  saveRam(wpcSystem);
  resumeEmu();
}

function loadState() {
  pauseEmu();
  loadRam(wpcSystem);
  resumeEmu();
}

function romSelection(romName) {
  initEmuWithGameName(romName);
}

function initEmuWithGameName(name) {
  const gameEntry = gamelist.getByName(name);
  populateControlUiView(gameEntry, gamelist, name);
  return initialiseEmu(gameEntry)
    .then(() => {
      resumeEmu();
      return initialiseActions(gameEntry.initialise, wpcSystem);
    });
}

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  // NOTE: works only via SSL!
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

initEmuWithGameName(INITIAL_GAME);

//called at 60hz -> 16.6ms
function step() {
  wpcSystem.executeCycle(TICKS_PER_CALL, TICKS_PER_STEP);
  const emuState = wpcSystem.getUiState();
  const cpuRunningState = intervalId ? 'running' : 'paused';
  emuDebugUi.updateCanvas(emuState, cpuRunningState);
  intervalId = requestAnimationFrame(step);

  if (dmdDump) {
    dmdDump.addFrames(emuState.asic.dmd.videoOutputBuffer);

    if (dmdDump.getCapturedFrames() > 1000) {
      saveFile(dmdDump.buildExportFile());
      dmdDump = null;
    }
  }
}

function resumeEmu() {
  if (intervalId) {
    pauseEmu();
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

window.addEventListener('keydown', (e) => {
  console.log('check', e.keyCode);
  switch (e.keyCode) {
    case 80: //P
      return pauseEmu();

    case 82: //R
      return resumeEmu();

    case 83: //S
      return saveState();

    case 76: //L
      return loadState();

    case 55: //7
      return wpcSystem.setCabinetInput(16);

    case 56: //8
      return wpcSystem.setCabinetInput(32);

    case 57: //9
      return wpcSystem.setCabinetInput(64);

    case 48: //0
      return wpcSystem.setCabinetInput(128);

    default:

  };
}, false);
