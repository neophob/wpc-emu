'use strict';

import '../node_modules/milligram/dist/milligram.css';
import '../styles/client.css';

import { downloadFileFromUrlAsUInt8Array } from './lib/fetcher';
import { initialiseActions } from './lib/initialise';
import { loadRam, saveRam, } from './lib/ramState';
import { initialise as initDmdExport, save as saveFile } from './lib/pin2DmdExport';
import { AudioOutput } from './lib/sound';
import * as gamelist from './db/gamelist';
import { populateControlUiView, updateUiSwitchState } from './ui/control-ui';
import * as emuDebugUi from './ui/oblivion-ui';

const Webclient = require('../../lib/webclient');
let webclient;

const MAXIMAL_DMD_FRAMES_TO_RIP = 8000;
const INITIAL_GAME = 'WPC-DMD: Hurricane';

let soundInstance = AudioOutput();
let dmdDump;
let intervalId;

function initialiseEmu(gameEntry) {
  window.wpcInterface = {
    romSelection,
  };

  return document.fonts.load('24pt "Space Mono"')
    .catch((error) => {
      console.error('FONT_LOAD_FAILED', error);
    })
    .then(() => {
      emuDebugUi.initialise();
      emuDebugUi.loadFeedback(gameEntry.name);
      return downloadFileFromUrlAsUInt8Array(gameEntry.rom.u06);
    })
    .then((u06Rom) => {
      console.log('Successfully loaded ROM', u06Rom.length);
      const romData = {
        u06: u06Rom,
      };
console.log('webclient.initialiseEmulator', gameEntry);
      return webclient.initialiseEmulator(romData, gameEntry);
    })
    .then(() => {
      console.log('Successfully initialized emulator');
      return webclient.getVersion();
    })
    .then((emuVersion) => {

      const selectElementRoot = document.getElementById('wpc-release-info');
      selectElementRoot.innerHTML = 'WPC-Emu v' + emuVersion;
      soundInstance = AudioOutput(gameEntry.audio);
      //NOTE: IIKS we pollute globals here
      window.wpcInterface = {
        resetEmu,
        pauseEmu,
        resumeEmu,
        romSelection,
        saveState,
        loadState,
        toggleDmdDump
      };

//      wpcSystem.registerAudioConsumer((message) => soundInstance.callback(message));
//      wpcSystem.start();
//      console.log('Successfully started EMU v' + wpcSystem.version());
      return emuDebugUi.populateInitialCanvas(gameEntry);
    })
    .then(() => {
      soundInstance.playBootSound();
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

function toggleDmdDump() {
  const element = document.getElementById('dmd-dump-text');
  if (dmdDump) {
    saveFile(dmdDump.buildExportFile(), 'wpc-emu-dump.raw');
    element.textContent = 'DMD DUMP';
    element.classList.remove('blinkText');
    dmdDump = null;
  } else {
    dmdDump = initDmdExport();
    element.classList.add('blinkText');
  }
}

function romSelection(romName) {
  pauseEmu();
  initEmuWithGameName(romName);
}

function initEmuWithGameName(name) {
  soundInstance.stop();
  const gameEntry = gamelist.getByName(name);
  populateControlUiView(gameEntry, gamelist, name);
  return initialiseEmu(gameEntry)
    .then(resumeEmu)
    .then(() => initialiseActions(gameEntry.initialise, webclient))
    .catch((error) => {
      console.error('FAILED to load ROM:', error.message);
      emuDebugUi.errorFeedback(error);
    });
}

//called at 60hz -> 16.6ms
function step() {
/*  if (!wpcSystem) {
    return;
  }
  wpcSystem.executeCycle(TICKS_PER_CALL, TICKS_PER_STEP);
  const emuState = wpcSystem.getUiState();
  const cpuRunningState = 'running';//intervalId ? 'running' : 'paused';
  const audioState = soundInstance.getState();
  emuDebugUi.updateCanvas(emuState, cpuRunningState, audioState);
  if (emuState.asic.wpc.inputState) {
    updateUiSwitchState(emuState.asic.wpc.inputState);
  }

  intervalId = requestAnimationFrame(step);
*/
  if (dmdDump) {
    //TODO moveme
    dmdDump.addFrames(emuState.asic.dmd.videoOutputBuffer, emuState.cpuState.tickCount);

    const capturedFrames = dmdDump.getCapturedFrames();
    if (capturedFrames > MAXIMAL_DMD_FRAMES_TO_RIP) {
      const filename = 'wpc-emu-dump-' + Date.now() + '.raw';
      saveFile(dmdDump.buildExportFile(), filename);
      dmdDump = initDmdExport();
    }

    const element = document.getElementById('dmd-dump-text');
    element.textContent = 'DUMPING: ' + dmdDump.getCapturedFrames();
  }
}

function resumeEmu() {
  return webclient.resumeEmulator();
}

function pauseEmu() {
  return webclient.pauseEmulator();
}

function resetEmu() {
  return webclient.resetEmulator();
  //soundInstance.playBootSound();
}

function registerKeyboardListener() {
  console.log(
    '## KEYBOARD MAPPING:\n' +
    '  "1": Coin#1\n' +
    '  "2": Coin#2\n' +
    '  "3": Coin#3\n' +
    '  "4": Coin#4\n' +
    '  "5": Start\n' +
    '  "P": pause\n' +
    '  "R": resume\n' +
    '  "S": save\n' +
    '  "L": load\n' +
    '  "7": Escape\n' +
    '  "8": -\n' +
    '  "9": +\n' +
    '  "0": Enter'
  );

  window.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case 49: //1
        return wpcSystem.setCabinetInput(1);

      case 50: //2
        return wpcSystem.setCabinetInput(2);

      case 51: //3
        return wpcSystem.setCabinetInput(4);

      case 52: //4
        return wpcSystem.setCabinetInput(8);

      case 53: //5
        return wpcSystem.setInput(13);

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

    }
  }, false);

}

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  // NOTE: works only via SSL!
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      }).catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

webclient = Webclient.initialiseWebworker((data) => {
  const { emuState, emuRunningState } = data;
  emuDebugUi.updateCanvas(emuState, emuRunningState ? 'running' : 'paused');//, cpuRunningState, audioState);
});

initEmuWithGameName(INITIAL_GAME)
  .catch((error) => console.error);

registerKeyboardListener();
