'use strict';

const SoundBoard = require('../../lib/boards/sound');
const path = require('path');
const fs = require('fs');

const ROMPATH = process.env.ROMPATH || path.join(__dirname, '/../../rom/');

const u14Promise = loadFile(ROMPATH + 't2_u14.l3');
const u15Promise = loadFile(ROMPATH + 't2_u15.l3');
const u16Promise = loadFile(ROMPATH + 't2_u16.l3');

console.log('load sound rom..');
Promise.all([ u14Promise, u15Promise, u16Promise ])
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
      instance.executeCycle();
    });
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
