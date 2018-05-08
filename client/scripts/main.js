'use strict';

import '../node_modules/milligram/dist/milligram.css';
import '../styles/client.css';

import { downloadFileFromUrlAsUInt8Array } from './fetcher';
import { initialiseEmulator } from './emulator';
import * as gamelist from './db/gamelist';
import { populateControlUiView } from './ui/control-ui';
import * as emuDebugUi from './ui/emu-debug-ui';

function initialiseEmu(gameEntry) {
  return downloadFileFromUrlAsUInt8Array(gameEntry.url)
    .then((romData) => {
      return initialiseEmulator(romData, gameEntry);
    })
    .then((wpcSystem) => {
      // TODO IIKS we pollute globals here
      window.wpcInterface = {
        wpcSystem,
        pauseEmu,
        resumeEmu
      };
      console.log('Successully loaded ROM');
      wpcSystem.start();
      console.log('Successully started EMU');
      return emuDebugUi.initialise(wpcSystem);
    })
    .catch((error) => {
      console.error('FAILED to load ROM:', error.message);
    });
}

const gameEntry = gamelist.getByName('Hurricane');
//const gameEntry = gamelist.getByName('Terminator 2');
populateControlUiView(gameEntry);
initialiseEmu(gameEntry);

function pauseEmu() {
  emuDebugUi.stopEmu();
}

function resumeEmu() {
  emuDebugUi.startEmu();
}
