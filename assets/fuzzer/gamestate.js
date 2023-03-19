/*
# WPC-EMU game state fuzzer.

Step 1: Install radamsa (https://gitlab.com/akihe/radamsa)
Step 2: Create state file, see below "enable me to create the initial state file"
Step 3: Build fuzzed state files: npm run gamestate.buildinput
Step 4: Run fuzzer: npm run gamestate.fuzz

TODO:
- shuffle features (process.env?)
*/

const fs = require('fs');
const debug = require('debug')('wpcemu:fuzzer');
const Emulator = require('../../lib/emulator');

const romGamePath = '../../rom/HURCNL_2.ROM';
const testCaseNr = process.argv[2];

const INITIAL_DUMP = false;

let startTestCaseNr = 0;
let endTestCaseNr = 5000;

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
    return JSON.parse(fs.readFileSync('../../fuzz/out/fuzz-' + number));
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
      features: ['wpcDmd', 'securityPic', 'wpc95', 'wpcFliptronics'], //'securityPic', 'wpc95', 'wpcFliptronics', 'wpcDmd', 'wpcSecure', wpcAlphanumeric'
      fileName: romGamePath,
      skipWpcRomCheck: true,
    };
    return Emulator.initVMwithRom(romData, metaData);
  })
  .then((wpcSystem) => {
    debug('WPC System initialized');
    wpcSystem.start();
    wpcSystem.executeCycle(34482, 16);

    if (INITIAL_DUMP) {
      const emuState = wpcSystem.getState();
      fs.writeFileSync('state-hurricane', Buffer.from(JSON.stringify(emuState)));
      return;
    }

    for (let i = startTestCaseNr; i < endTestCaseNr; i++) {
      console.log('LOAD_STATE', i);
      const state = loadState(i);
      if (state) {
        try {
          wpcSystem.setState(state);
          wpcSystem.executeCycle(64, 16);
          console.log(' > STATE_LOADED', i);
        } catch(error) {
          console.error(' > STATE_ERR_' + i, error.message);
          console.error(error);
        }
      }
    }
  })
  .catch((error) => {
    console.error('EXCEPTION!', error.message);
    console.error(error);
  });
