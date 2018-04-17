'use strict';

const wpc = require('./lib/wpc');
const debug = require('debug')('wpcemu:romloader');

const romPath = process.argv[2] || 'rom/HURCNL_2.ROM';

if (!romPath) {
  console.error('Parameter [ROM PATH]');
  process.exit(1);
}

function runWpsMainloop(wpcSystem) {
  setInterval(() => {
    const t1 = Date.now();
    wpcSystem.executeCycle();
    //client.sendMemData(nes.memory.ram);
    const duration = Date.now() - t1;
    debug('cycle time:', duration, 'fps:', (1000/duration));
  }, 10);
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
