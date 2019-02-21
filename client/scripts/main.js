'use strict';

import '../node_modules/milligram/dist/milligram.css';
import '../styles/client.css';

import { downloadFileFromUrlAsUInt8Array } from './lib/fetcher';
import { initialiseEmulator } from './lib/emulator';
import { initialiseActions } from './lib/initialise';
import { loadRam, saveRam, } from './lib/ramState';
import { initialise as initDmdExport, save as saveFile } from './lib/pin2DmdExport';
import { AudioOutput } from './lib/sound';
import { pairBluetooth, restartBluetoothController } from './bluetooth/index';
import * as gamelist from './db/gamelist';
import { populateControlUiView } from './ui/control-ui';
import * as emuDebugUi from './ui/emu-debug-ui';

const MAXIMAL_DMD_FRAMES_TO_RIP = 8000;
const TICKS_PER_SECOND = 2000000;
const DESIRED_FPS = 58;
const TICKS_PER_CALL = parseInt(TICKS_PER_SECOND / DESIRED_FPS, 10);
const TICKS_PER_STEP = 16;
const INITIAL_GAME = 'WPC-Fliptronics: Fish Tales';
const FREQUENCY_HZ = 50;

const soundInstance = AudioOutput();

var wpcSystem;
var intervalId;
var lastZeroContCounter = 0;
var bleMessageCount = 0;
var dmdDump;

function pairing() {
  pairBluetooth((error, data) => {
    if (error) {
      console.log('error', error);
      return;
    }
    if (lastZeroContCounter === 0) {
      cancelAnimationFrame(intervalId);
      lastZeroContCounter = data.zeroCrossCounter;
      console.log('Switch to BLE MODE');
      //TODO check for time drift, reset pinball & emu if drift is too big
    } else {
      bleMessageCount++;

      if (data.inputSwitchStateLo) {
        wpcSystem.setDirectInput(1, (data.inputSwitchStateLo >> 24) & 0xFF);
        wpcSystem.setDirectInput(2, (data.inputSwitchStateLo >> 16) & 0xFF);
        wpcSystem.setDirectInput(3, (data.inputSwitchStateLo >> 8) & 0xFF);
        wpcSystem.setDirectInput(4, data.inputSwitchStateLo & 0xFF);
      }
      if (data.inputSwitchStateHi) {
        wpcSystem.setDirectInput(5, (data.inputSwitchStateHi >> 24) & 0xFF);
        wpcSystem.setDirectInput(6, (data.inputSwitchStateHi >> 16) & 0xFF);
        wpcSystem.setDirectInput(7, (data.inputSwitchStateHi >> 8) & 0xFF);
        wpcSystem.setDirectInput(8, data.inputSwitchStateHi & 0xFF);
      }
      if (data.coinDoorState) {
        //console.log('coindoor',data.coinDoorState);
        //wpcSystem.setDirectInput(0, data.coinDoorState);
      }
      if (data.zeroCrossCounter) {
        const deltaCrossCounter = data.zeroCrossCounter - lastZeroContCounter;
        const deltaTicks = parseInt(deltaCrossCounter * (TICKS_PER_SECOND / FREQUENCY_HZ), 10);
        lastZeroContCounter = data.zeroCrossCounter;
        wpcSystem.executeCycle(deltaTicks, TICKS_PER_STEP);
        const emuState = wpcSystem.getUiState();
        emuDebugUi.updateCanvas(emuState, 'running BLE SYNC', bleMessageCount);
      }
    }
  })
  .catch((error) => {
    console.error('BT Pairing failed:', error.message);
  });
}

function initialiseEmu(gameEntry) {
  emuDebugUi.initialise(gameEntry);
  window.wpcInterface = {
    romSelection,
  };

  emuDebugUi.loadFeedback(gameEntry.name);

  const u06Promise = downloadFileFromUrlAsUInt8Array(gameEntry.rom.u06);

  return Promise.all([
      u06Promise,
    ])
    .then((romFiles) => {
      console.log('Successfully loaded ROM', romFiles[0].length);
      const romData = {
        u06: romFiles[0],
      };
      return initialiseEmulator(romData, gameEntry);
    })
    .then((_wpcSystem) => {
      console.log('Successfully initialized emulator');
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
        toggleDmdDump,
        pairBluetooth: pairing,
        restartBluetoothController,
      };
      wpcSystem.registerAudioConsumer((message) => soundInstance.callback(message) );
      wpcSystem.start();
      console.log('Successfully started EMU v' + wpcSystem.version());
      return emuDebugUi.populateInitialCanvas(gameEntry);
    })
    .catch((error) => {
      console.error('FAILED to load ROM:', error.message);
      emuDebugUi.errorFeedback(error);
      throw error;
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
    .then(() => {
      resumeEmu();
      return initialiseActions(gameEntry.initialise, wpcSystem);
    });
}

//called at 60hz -> 16.6ms
function step() {
  if (!wpcSystem) {
    return;
  }
  wpcSystem.executeCycle(TICKS_PER_CALL, TICKS_PER_STEP);
  const emuState = wpcSystem.getUiState();
  const cpuRunningState = intervalId ? 'running' : 'paused';
  emuDebugUi.updateCanvas(emuState, cpuRunningState);
  intervalId = requestAnimationFrame(step);

  if (dmdDump) {
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
  if (intervalId) {
    pauseEmu();
  }
  console.log('client start emu');
  intervalId = requestAnimationFrame(step);
}

function pauseEmu() {
  console.log('stop emu');
  if (wpcSystem) {
    emuDebugUi.updateCanvas(wpcSystem.getUiState(), 'paused');
  }

  soundInstance.stop();
  if (!intervalId) {
    // allows step by step
    step();
  }

  cancelAnimationFrame(intervalId);
  intervalId = false;
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
    navigator.serviceWorker.register('service-worker.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(registrationError => {
      console.log('SW registration failed:', registrationError);
    });
  });
}

initEmuWithGameName(INITIAL_GAME);
registerKeyboardListener();
