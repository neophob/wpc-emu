'use strict';

// Run using "afl-fuzz -i fuzz/in/ -o fuzz/out/ -n -t 500 -- node fuzz.js"
// too slow!

// Build mutation of example input file:
// radamsa -n 1000 -o fuzz/out/fuzz-%n -v fuzz/in/state-hurricane

const fs = require('fs');
const debug = require('debug')('wpcemu:index');
const Emulator = require('./lib/emulator');

const romGamePath = 'rom/HURCNL_2.ROM';
const testCaseNr = process.argv[2];

let startTestCaseNr = 0;
let endTestCaseNr = 10000;

if (testCaseNr) {
  const nr = parseInt(testCaseNr, 10);
  startTestCaseNr = nr;
  endTestCaseNr = nr + 1;
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

function loadState(number) {
  try {
    return JSON.parse(fs.readFileSync('fuzz/out/fuzz-' + number));
  } catch(error) {
    //console.log('INVALID_JSON', error.message);
  }
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
    wpcSystem.executeCycle(34482, 16);

    for (let i = startTestCaseNr; i < endTestCaseNr; i++) {
      console.log('LOAD_STATE', i);
      const state = loadState(i);
      if (state) {
        try {
          wpcSystem.setState(state);
          wpcSystem.executeCycle(64, 16);
          console.log(' > STATE_LOADED', i);
        } catch(error) {
          console.log(' > STATE_ERR_' + i, error.message);
          console.log(error)
        }
      }
    }
    //const emuState = wpcSystem.getState();
    //fs.writeFileSync('state-hurricane', Buffer.from(JSON.stringify(emuState)));
  })
  .catch((error) => {
    console.log('EXCEPTION!', error.message);
    console.log(error.stack);
  });
