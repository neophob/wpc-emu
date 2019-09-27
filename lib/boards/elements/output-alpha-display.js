'use strict';

const debug = require('debug')('wpcemu:boards:elements:outputAlphaDisplay');

module.exports = {
  getInstance,
};

function getInstance() {
  return new OutputAlphaDisplay();
}

const SEG_UL_DIAG    = 0x0001;
const SEG_VERT_TOP   = 0x0002;
const SEG_UR_DIAG    = 0x0004;
const SEG_MID_RIGHT  = 0x0008;
const SEG_LR_DIAG    = 0x0010;
const SEG_VERT_BOT   = 0x0020;
const SEG_LL_DIAG    = 0x0040;
const SEG_COMMA      = 0x0080;
const SEG_TOP        = 0x0100;
const SEG_UPR_RIGHT  = 0x0200;
const SEG_LWR_RIGHT  = 0x0400;
const SEG_BOT        = 0x0800;
const SEG_LWR_LEFT   = 0x1000;
const SEG_UPR_LEFT   = 0x2000;
const SEG_MID_LEFT   = 0x4000;
const SEG_PERIOD     = 0x8000;

class OutputAlphaDisplay {
  constructor() {
    this.segmentColumn = 0;
    this.displayData = new Uint16Array(16 * 2).fill(0);
  }

  setSegmentColumn(value) {
    this.segmentColumn = value & 0x0F;
    debug('setSegmentColumn', this.segmentColumn);
    console.log('setSegmentColumn', this.segmentColumn);
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
    console.log(val);
  }

  setRow1(isLow, value) {
    console.log('setRow1', isLow, value);
    this._update(0, isLow, value);
  }

  setRow2(isLow, value) {
    console.log('setRow2', isLow, value);    
    this._update(16, isLow, value);
  }

}
