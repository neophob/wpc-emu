'use strict';

import '../node_modules/milligram/dist/milligram.css';
import '../styles/client.css';
import viewTpl from './main.view.tpl';

import { downloadFileFromUrlAsUInt8Array } from './fetcher';
import { initialiseEmulator } from './emulator';
import { replaceNode } from './htmlselector';
import * as emuDebugUi from './emuDebugUi';

function initialiseView() {
  const div = document.createElement('div');
  div.insertAdjacentHTML('afterbegin', viewTpl);
  replaceNode('rootNode', div);
}

function initialiseEmu(romUrl) {
  const romFileName = romUrl.substring(romUrl.lastIndexOf('/')+1);
  downloadFileFromUrlAsUInt8Array(romUrl)
    .then((romData) => {
      return initialiseEmulator(romData, romFileName);
    })
    .then((wpcSystem) => {
      // IIKS we pollute globals here
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

initialiseView();
initialiseEmu('https://s3-eu-west-1.amazonaws.com/foo-temp/t2_l8.rom');

function pauseEmu() {
  emuDebugUi.stopEmu();
}

function resumeEmu() {
  emuDebugUi.startEmu();
}
