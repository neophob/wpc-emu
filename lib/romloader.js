'use strict';

const fs = require('fs');
const debug = require('debug')('wpcemu:romloader');

const MINIMAL_ROM_SIZE_BYTES = 128 * 1024;

module.exports = {
  loadRom,
};

function readFileAsUint8Array(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) {
        return reject(error);
      }
      const buffer = new Uint8Array(data);
      resolve(buffer);
    });
  });
}

function parseRom(uint8Buffer) {
  return new Promise((resolve, reject) => {
    if (!uint8Buffer || uint8Buffer.length < MINIMAL_ROM_SIZE_BYTES) {
      return reject(new Error('INVALID_ROM_SIZE'));
    }
    debug('rom size: %s bytes', uint8Buffer.length);
    resolve(uint8Buffer);
  });
}

function loadRom(fileName) {
  debug('loadRom:', fileName);
  return readFileAsUint8Array(fileName)
    .then((data) => {
      return parseRom(data);
    });
}
