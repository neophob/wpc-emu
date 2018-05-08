'use strict';

import '../node_modules/milligram/dist/milligram.css';
import '../styles/client.css';

import { downloadFileFromUrlAsUInt8Array } from './fetcher';
import { initialiseEmulator } from './emulator';
import * as gamelist from './db/gamelist';
import { populateControlUiView } from './ui/controlUi';
import * as emuDebugUi from './ui/emuDebugUi';

function initialiseEmu(romUrl) {
  const romFileName = romUrl.substring(romUrl.lastIndexOf('/')+1);
  return downloadFileFromUrlAsUInt8Array(romUrl)
    .then((romData) => {
      return initialiseEmulator(romData, romFileName);
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

const gameEntry = gamelist.getByName('Hurricane');//Terminator 2');
populateControlUiView(gameEntry);
initialiseEmu(gameEntry.url);

function pauseEmu() {
  emuDebugUi.stopEmu();
}

function resumeEmu() {
  emuDebugUi.startEmu();
}
