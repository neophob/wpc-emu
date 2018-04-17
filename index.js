'use strict';

const romloader = require('./lib/romloader');
const debug = require('debug')('wpcemu:romloader');

const romPath = process.argv[2] || 'rom/HURCNL_2.ROM';

if (!romPath) {
  console.error('Parameter [ROM PATH]');
  process.exit(1);
}

/*function runWpsMainloop(nes) {
  setInterval(() => {
    const t1 = Date.now();
    nes.executeCycle();
    //client.sendMemData(nes.memory.ram);
    const duration = Date.now() - t1;
    console.log('cycle time:', duration, 'fps:', (1000/duration)|0, nes.cpu.registerPC);
  }, NTSC_INTERVAL);
}
*/

romloader.loadRom(romPath)
  .then(() => {
    debug('rom loaded');
  })
  .catch((error) => {
    console.log('EXCEPTION! Hint: make sure to run with node6+');
    console.log(error.stack);
  });
