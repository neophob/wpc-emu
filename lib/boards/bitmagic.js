'use strict';
/*jshint bitwise: false*/

module.exports = {
  findMsbBit
};

function findMsbBit(n) {
  const index = [ 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80 ].indexOf(n);
  return index > -1 ? index + 1 : 0;
}
