'use strict';

const Emulator = require('./lib/emulator');
const debug = require('debug')('wpcemu:index');
const blocked = require('blocked');

const romPath = process.argv[2] || 'rom/HURCNL_2.ROM';
const ALERT_WHEN_EVENTLOOP_IS_BLOCKED_MS = 100;

if (!romPath) {
  console.error('Parameter [ROM PATH]');
  process.exit(1);
}

function runWpsMainloop(wpcSystem) {
  setInterval(() => {
    wpcSystem.executeCycle();
  }, 0);
}

Emulator.initVMwithRom(romPath)
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
