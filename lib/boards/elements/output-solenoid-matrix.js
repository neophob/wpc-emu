'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:elements:outputSolenoidMatrix');

module.exports = {
  getInstance,
};

function getInstance(updateAfterTicks) {
  return new OutputSolenoidMatrix(updateAfterTicks);
}

const MATRIX_COLUMN_SIZE = 64;
const ALL_SOLENOID_OFF = 0x00;

/*
$3FE0     Byte     WPC_SOLENOID_GEN_OUTPUT (7-0: W: Enables for solenoids 25-29) or 25-28???
$3FE1     Byte     WPC_SOLENOID_HIGHPOWER_OUTPUT (7-0: W: Enables for solenoids 1-8)
$3FE2     Byte     WPC_SOLENOID_FLASH1_OUTPUT (7-0: W: Enables for solenoids 17-28)
$3FE3     Byte     WPC_SOLENOID_LOWPOWER_OUTPUT (7-0: W: Enables for solenoids 9-16)
*/

const WPC_SOLENOID_GEN_OUTPUT = 0x3FE0;
const WPC_SOLENOID_HIGHPOWER_OUTPUT = 0x3FE1;
const WPC_SOLENOID_FLASH1_OUTPUT = 0x3FE2;
const WPC_SOLENOID_LOWPOWER_OUTPUT = 0x3FE3;

class OutputSolenoidMatrix {
  constructor(updateAfterTicks) {
    this.updateAfterTicks = updateAfterTicks;
    this.solenoidState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_SOLENOID_OFF);
    this.activeRow = 0;
    this.activeColumn = 0;
    this.ticks = 0;
  }

  _updateSolenoidsPacked(offset, value) {
    for (var i = 0; i < 8; i++) {
      if (value & (1 << i)) {
        this.solenoidState[offset + i] = 0xFF;
      }
    }
  }

  executeCycle(ticks) {
    this.ticks += ticks;
    // output solenoids state @ 60hz/8 - TODO
    if (this.ticks >= this.updateAfterTicks) {
      debug('update solenoids state');
      this.ticks -= this.updateAfterTicks;
      this.solenoidState = this.solenoidState
        .map((state) => state >>> 1);
    }
  }

  setActive(sourceAddress, value) {
    if (value < 0 || value > 0xFF) {
      throw new Error('SOLENOID_MATRIX_INVALID_VALUE_' + value);
    }
    switch (sourceAddress) {
      case WPC_SOLENOID_GEN_OUTPUT:
        return this._updateSolenoidsPacked(24, value);
      case WPC_SOLENOID_HIGHPOWER_OUTPUT:
        return this._updateSolenoidsPacked(0, value);
      case WPC_SOLENOID_FLASH1_OUTPUT:
        return this._updateSolenoidsPacked(16, value);
      case WPC_SOLENOID_LOWPOWER_OUTPUT:
        return this._updateSolenoidsPacked(8, value);
      default:
        throw new Error('SOLENOID_MATRIX_INVALID_OFFSET_' + sourceAddress.toString(16));
    }
  }
}
