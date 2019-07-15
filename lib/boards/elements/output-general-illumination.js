'use strict';

const debug = require('debug')('wpcemu:boards:elements:outputGeneralIllumination');

module.exports = {
  getInstance,
};

function getInstance(isWpc95) {
  return new OutputSolenoidMatrix(isWpc95);
}

// general illumination supports up to 5 lamp groups, Coin door enable relay (Bit 5), Flipper enable relay (Bit 7)
// TODO: brightness level 7+8 do not work, no IRQ count for those entries
const MATRIX_COLUMN_SIZE = 8;
const ALL_LAMPS_OFF = 0x00;
const WPC95_TRIAC_MASK = 0xE7;
const COIN_DOOR_ENABLE_BIT = 5;
const UNKNOWN_BIT = 6;
const FLIPPER_RELAY_BIT = 7;

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
    debug('UPDATE_TRIAC', normalizedValue, irqCountGI);

    for (let i = 0; i < 5; i++) {
      if (normalizedValue & (1 << i)) {
        if (this.generalIlluminationState[i] > 5) {
          this.generalIlluminationState[i] = 7;
        } else {
          this.generalIlluminationState[i] = irqCountGI > 7 ? 0 : 7 - irqCountGI;
        }
      } else {
        if (this.generalIlluminationState[i]) {
          this.generalIlluminationState[i]--;
        }
      }
    }

    this.generalIlluminationState[COIN_DOOR_ENABLE_BIT] = normalizedValue & (1 << COIN_DOOR_ENABLE_BIT) * 8;
    this.generalIlluminationState[UNKNOWN_BIT] = normalizedValue & (1 << UNKNOWN_BIT) * 8;
    this.generalIlluminationState[FLIPPER_RELAY_BIT] = normalizedValue & (1 << FLIPPER_RELAY_BIT) * 8;
  }

  getNormalizedState() {
    return this.generalIlluminationState.map((value) => value * 31);
  }

  getUint8ArrayFromState(giState) {
    const normalizedGiState = giState.map((value) => value / 31);
    return Uint8Array.from(normalizedGiState);
  }

}
