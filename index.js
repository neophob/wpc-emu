'use strict';

const fs = require('fs');
const debug = require('debug')('wpcemu:index');
const Emulator = require('./lib/emulator');

const romPath = process.argv[2] || 'rom/HURCNL_2.ROM';

if (!romPath) {
  console.error('Parameter [ROM PATH]');
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

loadFile(romPath)
  .then((romBinary) => {
    return Emulator.initVMwithRom(romBinary, { fileName: romPath });
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
