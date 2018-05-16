'use strict';

const fs = require('fs');
const debug = require('debug')('wpcemu:index');
const Emulator = require('./lib/emulator');

const romGamePath = process.argv[2] || 'rom/HURCNL_2.ROM';
const romU14Path = process.argv[3] || 'rom/U14.PP';
const romU15Path = process.argv[4] || 'rom/U15.PP';
const romU18Path = process.argv[5] || 'rom/U18.PP';

if (!romGamePath) {
  console.error('Parameter [GAME_ROM_PATH] [U14_ROM_PATH] [U15_ROM_PATH] [U18_ROM_PATH]');
  throw new Error('MISSING_PARAMETER');
}

function loadFile(fileName) {
  debug('loadFile', fileName);
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(new Uint8Array(data));
    });
  });
}

function runWpsMainloop(wpcSystem) {
  setInterval(() => {
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();

    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
  }, 0);
}

const loadRomFilesPromise = Promise.all([
  loadFile(romGamePath),
  loadFile(romU14Path),
  loadFile(romU15Path),
  loadFile(romU18Path),
]);

loadRomFilesPromise
  .then((romBinariesArray) => {
    return Emulator.initVMwithRom(romBinariesArray, { fileName: romGamePath });
  })
  .then((wpcSystem) => {
    debug('WPC System initialised');
    wpcSystem.start();
    runWpsMainloop(wpcSystem);
  })
  .catch((error) => {
    console.log('EXCEPTION!', error.message);
    console.log(error.stack);
  });
