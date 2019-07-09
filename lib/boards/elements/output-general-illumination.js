'use strict';

const debug = require('debug')('wpcemu:boards:elements:outputGeneralIllumination');

module.exports = {
  getInstance,
};

function getInstance(isWpc95) {
  return new OutputSolenoidMatrix(isWpc95);
}

// general illumination supports up to 8 lamp groups
const MATRIX_COLUMN_SIZE = 8;
const ALL_LAMPS_OFF = 0x00;

const WPC95_TRIAC_MASK = 0xE7;

const IRQCOUNT_TO_BRIGHTNESS_MAP = [ 7, 6, 5, 4, 3, 2, 1, 7 ];

class OutputSolenoidMatrix {

  constructor(isWpc95 = false) {
    this.generalIlluminationState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_LAMPS_OFF);
    this.lastValue = -1;
    this.isWpc95 = isWpc95;
  }

  update(value, irqCountGI = 0) {
    // WPC-95 only controls 3 of the 5 Triacs, the other 2 are ALWAYS ON, power wired directly
    const normalizedValue = this.isWpc95 ? (value & WPC95_TRIAC_MASK) | 0x18 : value;
    if (normalizedValue === this.lastValue) {
      return;
    }

    this.lastValue = normalizedValue;
    console.log('UPDATE_TRIAC', normalizedValue);
    debug('UPDATE_TRIAC', normalizedValue);
    for (let i = 0; i < 5; i++) {
      if (normalizedValue & (1 << i)) {
        console.log(i,'irqCountGI',irqCountGI, normalizedValue)

        this.generalIlluminationState[i] = IRQCOUNT_TO_BRIGHTNESS_MAP[ irqCountGI ];
      } else {
        console.log(i,'NOirqCountGI',irqCountGI, normalizedValue)
        if (this.generalIlluminationState[i]) {
          this.generalIlluminationState[i]--;
        } else {
          this.generalIlluminationState[i] = 0;
        }
      }
    }
  }

  getNormalizedState() {
    return this.generalIlluminationState.map((value) => value * 31);
  }

}
