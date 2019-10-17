'use strict';

/*
WPC-EMU rom fuzzer
*/

const fs = require('fs');
const debug = require('debug')('wpcemu:fuzzer');
const Emulator = require('../../lib/emulator');

const romGamePath = '../../rom/HURCNL_2.ROM';

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

loadFile(romGamePath)
  .then((u06Rom) => {
    const romData = {
      u06: u06Rom,
    };
    const metaData = {
      features: ['wpcDmd', 'securityPic', 'wpc95', 'wpcFliptronics'], //'securityPic', 'wpc95', 'wpcFliptronics', 'wpcDmd', 'wpcSecure', wpcAlphanumeric'
      fileName: romGamePath,
      skipWpcRomCheck: true,
    };
    return Emulator.initVMwithRom(romData, metaData);
  })
  .then((wpcSystem) => {
    debug('WPC System initialized');
    wpcSystem.start();
    for (let i = 0; i < 500000; i++) {

      for (let n = 0; n < 32768; n++) {
        wpcSystem.cpuBoard.systemRom[n] = parseInt(Math.random() * 0xFF, 10);
      }
      try {
        wpcSystem.executeCycle(34482, 16);
        wpcSystem.reset();
      } catch(error) {
        console.error(' > STATE_ERR_' + i, error.message);
        console.error(error)
      }
    }
  })
  .catch((error) => {
    console.error('EXCEPTION!', error.message);
    console.error(error);
  });
