'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:elements:outputGeneralIllumination');

module.exports = {
  getInstance,
};

function getInstance() {
  return new OutputSolenoidMatrix();
}

// general illumination supports up to 8 lamp groups
const MATRIX_COLUMN_SIZE = 8;
const ALL_LAMPS_OFF = 0x00;

class OutputSolenoidMatrix {
  constructor() {
    this.generalIlluminationState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_LAMPS_OFF);
    this.lastValue = -1;
  }

  update(value) {
    if (value === this.lastValue) {
      return;
    }
    this.lastValue = value;
    debug('UPDATE_TRIAC', value);
    for (var i = 0; i < 8; i++) {
      if (value & (1 << i)) {
        this.generalIlluminationState[i] = 0xFF;
      } else {
        this.generalIlluminationState[i] = 0x0;
      }
    }
  }

}
