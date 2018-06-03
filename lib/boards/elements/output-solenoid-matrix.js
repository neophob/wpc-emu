'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:elements:outputSolenoidMatrix');

module.exports = {
  getInstance,
};

// TODO must be implemented properly
// TODO move to timing
const CALL_UPDATELAMP_AFTER_TICKS = 33334 * 8;

function getInstance() {
  return new OutputSolenoidMatrix();
}

const MATRIX_COLUMN_SIZE = 64;
const ALL_SOLENOID_OFF = 0x00;

class OutputSolenoidMatrix {
  constructor() {
    this.solenoidState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_SOLENOID_OFF);
    this.activeRow = 0;
    this.activeColumn = 0;
    this.ticks = 0;
  }

  /*
  $3FE0     Byte     WPC_SOLENOID_GEN_OUTPUT (7-0: W: Enables for solenoids 25-29) or 25-28???
  $3FE1     Byte     WPC_SOLENOID_HIGHPOWER_OUTPUT (7-0: W: Enables for solenoids 1-8)
  $3FE2     Byte     WPC_SOLENOID_FLASH1_OUTPUT (7-0: W: Enables for solenoids 17-28)
  $3FE3     Byte     WPC_SOLENOID_LOWPOWER_OUTPUT (7-0: W: Enables for solenoids 9-16)
  */

  _updateSolenoids(offset, value) {
    for (var i = 0; i < 8; i++) {
      if (value & (1 << i)) {
        this.solenoidState[offset + i] = 0xFF;
      }
    }
  }

  executeCycle(ticks) {
    this.ticks += ticks;
    // output lamp state @ 60hz
    if (this.ticks >= CALL_UPDATELAMP_AFTER_TICKS) {
      debug('update solenoids state');
      this.ticks -= CALL_UPDATELAMP_AFTER_TICKS;
      for (var i = 0; i < MATRIX_COLUMN_SIZE; i++) {
        this.solenoidState[i] >>>= 1;
      }
    }
  }

  setActive(sourceAddress, value) {
    if (value < 1) {
      return;
    }
    switch (sourceAddress) {
      case 0x3FE0:
        return this._updateSolenoids(24, value);
      case 0x3FE1:
        return this._updateSolenoids(0, value);
      case 0x3FE2:
        return this._updateSolenoids(16, value);
      case 0x3FE3:
        return this._updateSolenoids(8, value);
      default:
        throw new Error('SOLENOD_MATRIX_INVALID_OFFSET_' + sourceAddress);
    }
  }
}
