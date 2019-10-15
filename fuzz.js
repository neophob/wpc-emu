'use strict';

// Run using "afl-fuzz -i fuzz/in/ -o fuzz/out/ -n -t 500 -- node fuzz.js"
// TODO: https://github.com/connor4312/js-fuzz

const fs = require('fs');
const debug = require('debug')('wpcemu:index');
const Emulator = require('./lib/emulator');

const romGamePath = 'rom/HURCNL_2.ROM';
const stateFileName = process.argv[2] || 'fuzz/in/state-hurricane';

if (!stateFileName) {
  console.error('Parameter [STATE-FILE]');
  throw new Error('MISSING_STATE-FILE');
}

const stateFile = '';
try {
  stateFile = JSON.parse(fs.readFileSync(stateFileName));
} catch(error) {
  console.log('INVALID_JSON', error.message);
  return 0;
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

loadFile(romGamePath)
  .then((u06Rom) => {
    const romData = {
      u06: u06Rom,
    };
    const metaData = {
      features: ['wpcDmd'], //'securityPic', 'wpc95', 'wpcFliptronics', 'wpcDmd', 'wpcSecure'
      fileName: romGamePath,
      skipWpcRomCheck: true,
    };
    return Emulator.initVMwithRom(romData, metaData);
  })
  .then((wpcSystem) => {
    debug('WPC System initialised');
    wpcSystem.start();
    wpcSystem.setState(stateFile);
    wpcSystem.executeCycle(34482, 16);
    wpcSystem.executeCycle(34482, 16);
    //const emuState = wpcSystem.getState();
    //fs.writeFileSync('state-hurricane', Buffer.from(JSON.stringify(emuState)));
  })
  .catch((error) => {
    console.log('EXCEPTION!', error.message);
    console.log(error.stack);
  });
