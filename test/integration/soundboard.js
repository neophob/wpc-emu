'use strict';

const SoundBoard = require('../../lib/boards/sound-board');
const path = require('path');
const fs = require('fs');

const ROMPATH = process.env.ROMPATH || path.join(__dirname, '/../../rom/');

const u14Promise = loadFile(ROMPATH + 't2_u14.l3');
const u15Promise = loadFile(ROMPATH + 't2_u15.l3');
const u18Promise = loadFile(ROMPATH + 't2_u18.l3');

console.log('load sound rom..');
Promise.all([ u14Promise, u15Promise, u18Promise ])
  .then((promiseArray) => {
    console.log('loaded...');
    const romObject = {
      u14: promiseArray[0],
      u15: promiseArray[1],
      u18: promiseArray[2],
    };
    const instance = SoundBoard.getInstance(romObject);
    instance.start();

    setInterval(() => {
      instance.executeCycle(16666, 10);
    }, 1000 / 60);
  })
  .catch((error) => {
    console.error('ERR!', error.message);
    console.error(error.stack);
  });







function loadFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(new Uint8Array(data));
    });
  });
}
