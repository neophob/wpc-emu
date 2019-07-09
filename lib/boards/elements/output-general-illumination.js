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

const WPC95_TRIAC_MASK = 0x07;
const PRE_WPC95_TRIAC_MASK = 0x1F;

class OutputSolenoidMatrix {

  constructor(isWpc95 = false) {
    this.generalIlluminationState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_LAMPS_OFF);
    this.lastValue = -1;
    this.isWpc95 = isWpc95;
  }

  update(value, irqCountGI = 0) {
    console.log(this.isWpc95)
    // WPC-95 only controls 3 of the 5 Triacs, the other 2 are ALWAYS ON, power wired directly
    const normalizedValue = this.isWpc95 ? (value & WPC95_TRIAC_MASK) | 0x18 : value & PRE_WPC95_TRIAC_MASK;

    /*
    const normalizedValue = value & (this.isWpc95 ? 0x07 : 0x1F)

			// The input side of the triac has a latch; store only the G.I.
			// related bits there
			linux_triac_latch = val & PINIO_GI_STRINGS;

			// The outputs are comprised of whatever GI strings are already
			// on, plus whatever outputs (GIs and relays) were just written.
			val |= linux_triac_outputs;
      sim_triac_update (val);
    */
    if (normalizedValue === this.lastValue) {
      return;
    }
console.log('triac', normalizedValue, normalizedValue, irqCountGI);
    this.lastValue = normalizedValue;
    debug('UPDATE_TRIAC', normalizedValue);
    for (let i = 0; i < 5; i++) {
      //TODO smoothing, see pinmame
      if (normalizedValue & (1 << i)) {
        this.generalIlluminationState[i] = 0xFF;
      } else {
        this.generalIlluminationState[i] = 0x0;
      }
    }
  }

}
