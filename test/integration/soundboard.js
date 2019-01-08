'use strict';

const fs = require('fs');
const path = require('path');
const SoundBoard = require('../../lib/boards/sound-board');

const MAXIMAL_SOUND_ROM_SIZE = 0x80000;
const SOUNDBOARD_CONCATENATED_ROM_SIZE = MAXIMAL_SOUND_ROM_SIZE * 3;

const ROMPATH = process.env.ROMPATH || path.join(__dirname, '/../../rom/');

const u14Promise = loadFile(ROMPATH + 't2_u14.l3');
const u15Promise = loadFile(ROMPATH + 't2_u15.l3');
const u18Promise = loadFile(ROMPATH + 't2_u18.l3');

function getSoundBoardSystemRom(uInt8Roms) {
  const u18Rom = uInt8Roms.u18;
  if (!u18Rom) {
    return;
  }
  return u18Rom.subarray(u18Rom.length - 0x4000, u18Rom.length);
}

function getConcatenatedSoundRoms(uInt8Roms) {
  if (!uInt8Roms.u18 || uInt8Roms.u18.length === 0 ||
    !uInt8Roms.u15 || !uInt8Roms.u14) {
    console.log('missing sound roms');
    return;
  }
  const ROM_OFFSET = 0x80000;
  const soundRom = new Uint8Array(SOUNDBOARD_CONCATENATED_ROM_SIZE).fill(0);
  console.log('u18 rom size: %s bytes', uInt8Roms.u18.length);
  if (uInt8Roms.u18.length > ROM_OFFSET) {
    throw new Error('U18_ROM_SIZE_EXCEEDED');
  }
  soundRom.set(uInt8Roms.u18, 0);

  if (uInt8Roms.u15) {
    console.log('u15 rom size: %s bytes', uInt8Roms.u15.length);
    if (uInt8Roms.u15.length > ROM_OFFSET) {
      throw new Error('U15_ROM_SIZE_EXCEEDED');
    }
    soundRom.set(uInt8Roms.u15, ROM_OFFSET);
  }
  if (uInt8Roms.u14) {
    console.log('u14 rom size: %s bytes', uInt8Roms.u14.length);
    if (uInt8Roms.u14.length > ROM_OFFSET) {
      throw new Error('U14_ROM_SIZE_EXCEEDED');
    }
    soundRom.set(uInt8Roms.u14, ROM_OFFSET * 2);
  }

  //copy systemrom to page 15 (15 x 32kb = 0x78000)
  const systemRom = getSoundBoardSystemRom(uInt8Roms);
  //soundRom.set(systemRom, 0x78000);
  soundRom.set(systemRom, 0x7C000);
  return soundRom;
}

console.log('load sound rom..');
Promise.all([ u14Promise, u15Promise, u18Promise ])
  .then((promiseArray) => {
    console.log('loaded...');
    const u18 = promiseArray[2];
    const romObject = {
      u14: promiseArray[0],
      u15: promiseArray[1],
      u18,
      soundSystemRom: u18.subarray(u18.length - 0x4000, u18.length),
    };
    const concatenatedSoundRom = getConcatenatedSoundRoms(romObject);
    const initObject = {
      interruptCallback: {
        firq: () => { console.log('FAKE FIRQ')},
      },
      romObject: {
        soundSystemRom: u18.subarray(u18.length - 0x4000, u18.length),
        concatenatedSoundRom,
      }
    };
    const instance = SoundBoard.getInstance(initObject);
    instance.reset();

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
