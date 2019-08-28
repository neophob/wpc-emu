'use strict';

module.exports = {
  toNumber,
  toBCD,
};

// based on https://gist.githubusercontent.com/joaomaia/3892692/raw/cb5eaef7ff9b6103490d4fc29b04cf95c5fde0b1/bcd2number.js

/**
 * convert a BCD encoded Uint8Array and convert it to a number
 * @param {Uint8Array} bcd
 * @returns {Number} decoded number
 */
function toNumber(bcd) {
  let n = 0;
  let m = 1;
  for (let i = 0; i < bcd.length; i++) {
    n += (bcd[bcd.length - 1 - i] & 0x0F) * m;
    n += ((bcd[bcd.length - 1 - i] >> 4) & 0x0F) * m * 10;
    m *= 100;
  }
  return n;
}

/**
 * converts a number to a BCD encoded number (Uint8Array)
 * @param {Number} number to convert
 * @returns {Uint8Array} encoded BCD number
 */
function toBCD(number) {
  const bcd = new Uint8Array(32).fill(0);

  console.log('in', number)
  let size = 0;
  while (number !== 0) {
    bcd[size] = (number % 10);
    number = (number / 10) | 0;
    bcd[size] += (number % 10) << 4;
    number = (number / 10) | 0;
    size++;
  }
  console.log('out', bcd.subarray(0, size).reverse())
  return bcd.subarray(0, size);
}
