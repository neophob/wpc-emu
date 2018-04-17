'use strict';

const wpc = require('./lib/wpc');
const debug = require('debug')('wpcemu:index');

const romPath = process.argv[2] || 'rom/HURCNL_2.ROM';

if (!romPath) {
  console.error('Parameter [ROM PATH]');
  process.exit(1);
}

function runWpsMainloop(wpcSystem) {
  setInterval(() => {
    wpcSystem.executeCycle();
  }, 0);
}


wpc.initVMwithRom(romPath)
  .then((wpcSystem) => {
    debug('WPC System initialised');
    wpcSystem.start();
    runWpsMainloop(wpcSystem);
  })
  .catch((error) => {
    console.log('EXCEPTION! Hint: make sure to run with node6+');
    console.log(error.stack);
  });
