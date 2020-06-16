'use strict';

import '../node_modules/milligram/dist/milligram.css';
import '../styles/client.css';

// reference the webworker from wep-emu
import WebWorker from 'worker-loader!./webworker.js';

import { downloadFileFromUrlAsUInt8Array } from './lib/fetcher';
import { initialiseActions } from './lib/initialise';
import { loadRam, saveRam, } from './lib/ramState';
import { initialise as initDmdExport, save as saveFile } from './lib/pin2DmdExport';
import { AudioOutput } from './lib/sound';
import * as gamelist from '../../lib/db';
import { populateControlUiView, updateUiSwitchState } from './ui/control-ui';
import * as emuDebugUi from './ui/oblivion-ui';

const WpcEmuWebWorkerApi = require('../../lib/webclient');

const DESIRED_FPS = 50;
const MAXIMAL_DMD_FRAMES_TO_RIP = 8000;
const INITIAL_GAME = 'WPC-DMD: Hurricane';

let soundInstance = AudioOutput();
let dmdDump;

const fpsTimes = [];
let lastFps = 1;
let missedDraw = 0;
let rafId;

function initializeEmu(gameEntry) {
  return document.fonts.load('24pt "Space Mono"')
    .catch((error) => {
      console.error('FONT_LOAD_FAILED', error);
    })
    .then(() => {
      const selectElementRoot = document.getElementById('wpc-release-info');
      selectElementRoot.innerHTML = 'WPC-Emu v' + global.RELEASE_VERSION;
      emuDebugUi.initialise();
      emuDebugUi.loadFeedback(gameEntry.name);
      return downloadFileFromUrlAsUInt8Array(gameEntry.rom.u06);
    })
    .then((u06Rom) => {
      console.log('Successfully loaded ROM', u06Rom.length);
      const romData = {
        u06: u06Rom,
      };
      return wpcEmuWebWorkerApi.initializeEmulator(romData, gameEntry);
    })
    .then((emuVersion) => {
      console.log('Successfully initialized emulator', emuVersion);
      soundInstance = AudioOutput(gameEntry.audio);
      //NOTE: IIKS we pollute globals here
      window.wpcInterface = {
        webclient: wpcEmuWebWorkerApi,
        resetEmu,
        pauseEmu,
        resumeEmu,
        romSelection,
        saveState,
        loadState,
        toggleDmdDump,
        toggleMemoryMonitor,
        memoryMonitorPrevPage,
        memoryMonitorNextPage,
        writeMemory,
        memoryFindData,
        memoryDumpData,
        help,
      };

      wpcEmuWebWorkerApi.registerAudioConsumer((message) => soundInstance.callback(message))
        .catch((error) => {
          console.error('FAILED_TO_REGISTER_AUDIO_CALLBACK', error);
        });
      wpcEmuWebWorkerApi.registerUiUpdateConsumer((emuUiState) => {
        const { emuState } = emuUiState;
        if (!emuState) {
          console.log('NO_EMU_STATE!');
          return;
        }
        if (rafId) {
          missedDraw++;
          //console.log('MISSED_DRAW!', rafId, missedDraw);
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame((timestamp) => {
          const audioState = soundInstance.getState();
          emuDebugUi.updateCanvas(emuState, 'running', audioState);

          const { averageRTTms, sentMessages, failedMessages } = wpcEmuWebWorkerApi.getStatistics();
          emuDebugUi.drawMetaData({
            averageRTTms, sentMessages, failedMessages, missedDraw, lastFps
          });
          if (emuState.asic.wpc.inputState) {
            updateUiSwitchState(emuState.asic.wpc.inputState);
          }

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

          while (fpsTimes.length > 0 && fpsTimes[0] <= timestamp - 1000) {
            fpsTimes.shift();
          }
          fpsTimes.push(timestamp);
          if (Math.abs(lastFps - fpsTimes.length) > 5) {
            lastFps = fpsTimes.length;
            //TODO: reduce FPS
            //wpcEmuWebWorkerApi.adjustFramerate(fpsTimes.length);
          }
          rafId = 0;
        });

      });
      return emuDebugUi.populateInitialCanvas(gameEntry);
    })
    .then(() => {
      soundInstance.playBootSound();
    });
}

function saveState() {
  return pauseEmu()
    .then(() => {
      return Promise.all([ wpcEmuWebWorkerApi.getEmulatorRomName(), wpcEmuWebWorkerApi.getEmulatorState() ]);
    })
    .then((data) => {
      const romName = data[0];
      const emuState = data[1];
      saveRam(romName, emuState);
      return resumeEmu();
    });
}

function loadState() {
  return pauseEmu()
    .then(() => {
      return wpcEmuWebWorkerApi.getEmulatorRomName();
    })
    .then((romName) => {
      const emuState = loadRam(romName);
      return wpcEmuWebWorkerApi.setEmulatorState(emuState);
    })
    .then(() => { return resumeEmu(); });
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
  if (dmdDump) {
    toggleDmdDump();
  }
  cancelAnimationFrame(rafId);
  rafId = undefined;
  return initEmuWithGameName(romName);
}

function initEmuWithGameName(name) {
  soundInstance.stop();
  const gameEntry = gamelist.getByName(name);
  populateControlUiView(gameEntry, gamelist, name);

  return initializeEmu(gameEntry)
    .then(resumeEmu)
    .then(() => wpcEmuWebWorkerApi.adjustFramerate(DESIRED_FPS))
    .then(() => initialiseActions(gameEntry.initialise, wpcEmuWebWorkerApi))
    .catch((error) => {
      console.error('FAILED to load ROM:', error.message);
      emuDebugUi.errorFeedback(error);
    });
}

function resumeEmu() {
  soundInstance.resume();
  return wpcEmuWebWorkerApi.resumeEmulator();
}

function toggleMemoryMonitor() {
  emuDebugUi.toggleMemoryView();
  emuDebugUi.memoryMonitorRefresh();
}

function memoryMonitorNextPage() {
  emuDebugUi.memoryMonitorNextPage();
  emuDebugUi.memoryMonitorRefresh();
}

function memoryMonitorPrevPage() {
  emuDebugUi.memoryMonitorPrevPage();
  emuDebugUi.memoryMonitorRefresh();
}

/**
 * Find data in emulator memory
 * @param {Number|String} value the value you are looking for
 * @param {String} encoding type of search, can be 'string', uint8, uint16
 * @param {Boolean} rememberResults only uint8 supported, remembers all the positions from a previous search
 */
function memoryFindData(value, encoding, rememberResults = false) {
  emuDebugUi.memoryFindData(value, encoding, rememberResults);
}

/**
 * Write directly to emulator memory
 * @param {Number} offset where to write
 * @param {Number|String} value String or uint8 value to write
 */
function writeMemory(offset, value) {
  return wpcEmuWebWorkerApi.writeMemory(offset, value);
}

/**
 * Print emulator memory content, if its a string the whole string will be shown
 * @param {Number} offset
 * @param {Number} optionalEndOffset
 */
function memoryDumpData(offset, optionalEndOffset) {
  emuDebugUi.memoryDumpData(offset, optionalEndOffset);
}

function pauseEmu() {
/*  const audioState = soundInstance.getState();
  emuDebugUi.updateCanvas(null, 'paused', audioState);
*/
  soundInstance.pause();
  cancelAnimationFrame(rafId);
  rafId = undefined;
  return wpcEmuWebWorkerApi.pauseEmulator();
}

function resetEmu() {
  soundInstance.playBootSound();
  return wpcEmuWebWorkerApi.resetEmulator();
}

function help() {
  console.log(
    '## WPC-EMU UI // KEYBOARD MAPPING:\n' +
    '  "1": Coin#1\n' +
    '  "2": Coin#2\n' +
    '  "3": Coin#3\n' +
    '  "4": Coin#4\n' +
    '  "5": Start\n' +
    '  "7": Escape\n' +
    '  "8": -\n' +
    '  "9": +\n' +
    '  "0": Enter\n' +
    '  "P": pause\n' +
    '  "R": resume\n' +
    '  "S": save\n' +
    '  "L": load\n' +
    '  "M": toggle memory monitor\n' +
    '  "N": memory monitor: next page\n' +
    '  "B": memory monitor: previous page\n' +
    '\n' +
    '       you can use the "wpcInterface" global to access to the internals of the emulator!\n' +
    ''
  );
}

function registerKeyboardListener() {
  help();
  window.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
      case 49: //1
        return wpcEmuWebWorkerApi.setCabinetInput(1);

      case 50: //2
        return wpcEmuWebWorkerApi.setCabinetInput(2);

      case 51: //3
        return wpcEmuWebWorkerApi.setCabinetInput(4);

      case 52: //4
        return wpcEmuWebWorkerApi.setCabinetInput(8);

      case 53: //5
        return wpcEmuWebWorkerApi.setSwitchInput(13);

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

      case 83: //S
        return saveState();

      case 76: //L
        return loadState();

      case 77: //M
        return toggleMemoryMonitor();

      case 78: //N
        return memoryMonitorNextPage();

      case 66: //B
        return memoryMonitorPrevPage();

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

const wpcEmuWebWorkerApi = WpcEmuWebWorkerApi.initializeWebworkerAPI(new WebWorker());

initEmuWithGameName(INITIAL_GAME)
  .catch((error) => console.error);

registerKeyboardListener();
