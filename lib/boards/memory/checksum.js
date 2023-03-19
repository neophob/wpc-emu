module.exports = {
  checksum16,
};

const INITIAL_VALUE = 0xFFFF;

/**
 * Calculate 16 bit checksum used in WPC-EMU RAM
 * @param {Uint8Array} uint8Array - the input data
 * @returns {Number} the calculated checksum
 */
function checksum16(uint8Array) {
  const sum = uint8Array.reduce((total, currentValue) => total + currentValue, 0);
  return INITIAL_VALUE - sum;
}
