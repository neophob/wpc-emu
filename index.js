'use strict';

const Emulator = require('./lib/emulator');
const debug = require('debug')('wpcemu:index');
const blocked = require('blocked');
const fs = require('fs');

const romPath = process.argv[2] || 'rom/HURCNL_2.ROM';
const ALERT_WHEN_EVENTLOOP_IS_BLOCKED_MS = 100;

if (!romPath) {
  console.error('Parameter [ROM PATH]');
  process.exit(1);
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
    return Emulator.initVMwithRom(romBinary, romPath);
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

blocked((ms) => {
  debug('WARNING_EVENT_LOOP_BLOCKED', ms);
}, { threshold: ALERT_WHEN_EVENTLOOP_IS_BLOCKED_MS });
