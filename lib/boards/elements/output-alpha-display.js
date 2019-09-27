'use strict';

const debug = require('debug')('wpcemu:boards:elements:outputAlphaDisplay');

// Emulates 2x 16-character alphanumeric displays, Each character is comprised of 14 line segments, a comma, and a period.

module.exports = {
  getInstance,
};

function getInstance() {
  return new OutputAlphaDisplay();
}

const SEG_UPPER_LEFT_DIAG = 0x0001;
const SEG_VERT_TOP = 0x0002;
const SEG_UPPER_RIGHT = 0x0004;
const SEG_MID_RIGHT = 0x0008;
const SEG_LOWER_RIGHT = 0x0010;
const SEG_VERT_BOT = 0x0020;
const SEG_LOWER_LEFT = 0x0040;
const SEG_COMMA = 0x0080;
const SEG_TOP = 0x0100;
const SEG_UPPER_RIGHT = 0x0200;
const SEG_LOWER_RIGHT = 0x0400;
const SEG_BOT = 0x0800;
const SEG_LOWER_LEFT = 0x1000;
const SEG_UPPER_LEFT = 0x2000;
const SEG_MID_LEFT = 0x4000;
const SEG_PERIOD = 0x8000;

class OutputAlphaDisplay {
  constructor() {
    this.segmentColumn = 0;
    this.displayData = new Uint16Array(16 * 2).fill(0);
  }

  setSegmentColumn(value) {
    this.segmentColumn = value & 0x0F;
    debug('setSegmentColumn', this.segmentColumn);
  }

  _update(offset, isLow, value) {
    let mask;
    if (isLow) {
      /* Uppermost word of 16-bit reg requires shifting value
      up by 8 bits.  Uppermost 8-bits will be cleared first. */
      mask = 0xFF00;
      value <<= 8;
    } else {
      /* Lower 8-bits need to be cleared first */
      mask = 0x00FF;
    }

    	/* The new segment values are set to the previous segments that aren't
         being touched by this update, plus the new segment values excluding
         comma and period. */         
    const val = (this.displayData[offset] & ~mask) | (value & ~(SEG_PERIOD | SEG_COMMA));
    if (val)
    console.log('_update', val);
  }

  setRow1(isLow, value) {
    this._update(0, isLow, value);
  }

  setRow2(isLow, value) {
    this._update(16, isLow, value);
  }

}
