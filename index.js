'use strict';

const fs = require('fs');
const debug = require('debug')('wpcemu:index');
const Emulator = require('./lib/emulator');

const romGamePath = process.argv[2] || 'rom/HURCNL_2.ROM';

if (!romGamePath) {
  console.error('Parameter [GAME_ROM_PATH]');
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

loadFile(romGamePath)
  .then((u06Rom) => {
    const romData = {
      u06: u06Rom,
    };
    return Emulator.initVMwithRom(romData, { fileName: romGamePath });
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
