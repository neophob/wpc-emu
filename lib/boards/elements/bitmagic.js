'use strict';

module.exports = {
  findMsbBit,
  setMsbBit,
};

function findMsbBit(uint8Value) {
  const index = [ 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80 ].indexOf(uint8Value);
  return index > -1 ? index + 1 : 0;
}

function setMsbBit(uint8Value = 0) {
  return [ 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80 ][uint8Value];
}
