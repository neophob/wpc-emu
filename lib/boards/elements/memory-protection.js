'use strict';
/*jshint bitwise: false*/

// calculate memory protection, ripped from pinmame

const SWAP_NIBBLE = [ 0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15 ];

module.exports = {
  getMemoryProtectionMask,
};

function getMemoryProtectionMask(value) {
  return 0xFFFF & (SWAP_NIBBLE[ value & 0x0F ] + (value & 0xF0) + 0x10) << 8;
}