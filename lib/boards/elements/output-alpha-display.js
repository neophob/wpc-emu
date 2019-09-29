'use strict';

const debug = require('debug')('wpcemu:boards:elements:outputAlphaDisplay');

/** 
 * Emulates 2x 16-character alphanumeric displays, Each character is comprised of 14 line segments, a comma, and a period.
 * Renders in DMD Display buffer (128 x 32)
 * Segment height is 15 pixel, segment width is 7 pixel:
 * 
3 3 3 3 3 3 3
3 3 0 3 0 3 3
3 3 0 3 0 3 3
3 2 1 3 0 3 3
3 1 2 3 3 0 3
3 0 3 3 3 0 3
3 0 3 3 3 0 3
3 3 3 3 3 3 3
3 0 3 3 3 0 3
3 0 3 3 3 0 3
3 0 3 3 3 0 3
3 3 0 3 0 3 3
3 3 0 3 0 3 3
3 3 0 3 0 3 3
3 3 3 3 3 3 3
 * 
 */ 

module.exports = {
  getInstance,
};

function getInstance(dmdPageSize) {
  return new OutputAlphaDisplay(dmdPageSize);
}

/*
   ___      SEG_TOP
  |\|/|     SEG_UPPER_LEFT SEG_UPPER_LEFT_DIAGONAL SEG_VERT_TOP SEG_UPPER_RIGHT_DIAGONAL SEG_UPPER_RIGHT
   - -      SEG_MIDDLE_LEFT SEG_MIDDLE_RIGHT
  |/|\|     SEG_LOWER_LEFT SEG_LOWER_LEFT_DIAGONAL SEG_VERT_BOT SEG_LOWER_RIGHT_DIAGONAL SEG_LOWER_RIGHT
   ---      SEG_BOTTOM
*/
const SEG_UPPER_LEFT_DIAGONAL = 0x0001;
const SEG_VERT_TOP = 0x0002;
const SEG_UPPER_RIGHT_DIAGONAL = 0x0004;
const SEG_MIDDLE_RIGHT = 0x0008;
const SEG_LOWER_RIGHT_DIAGONAL = 0x0010;
const SEG_VERT_BOT = 0x0020;
const SEG_LOWER_LEFT_DIAGONAL = 0x0040;
const SEG_COMMA = 0x0080;
const SEG_TOP = 0x0100; 
const SEG_UPPER_RIGHT = 0x0200;
const SEG_LOWER_RIGHT = 0x0400;
const SEG_BOTTOM = 0x0800;
const SEG_LOWER_LEFT = 0x1000;
const SEG_UPPER_LEFT = 0x2000;
const SEG_MIDDLE_LEFT = 0x4000;
const SEG_PERIOD = 0x8000;

const CHAR_WITH = 8;
const CHAR_HEIGHT = 15;

const OFFSET_LINE = 128;
const OFFSET_BOTTOM = OFFSET_LINE * (CHAR_HEIGHT - 1);
const OFFSET_MIDDLE = OFFSET_LINE * 7;

class OutputAlphaDisplay {

  constructor(dmdPageSize) {
    // 1 pixel uses 1 byte
    this.dmdPageSize = dmdPageSize * 8;
    this.segmentColumn = 0;
    this.displayData = new Uint16Array(16 * 2).fill(0);
  }

  setSegmentColumn(value) {
    this.segmentColumn = value & 0x0F;
    debug('setSegmentColumn', this.segmentColumn);
  }

  _update(offset, isLow, value) {

    //if (value)
    //console.log('set', this.segmentColumn + offset, value)

    if (isLow) {
      /* Uppermost word of 16-bit reg requires shifting value
      up by 8 bits.  Uppermost 8-bits will be cleared first. */
      this.displayData[this.segmentColumn + offset] |= (value<<8) & 0xFF00;
      //    const val = (this.displayData[offset] & ~mask) | value;

//      mask = 0xFF00;
      //value <<= 8;
    } else {
      /* Lower 8-bits need to be cleared first */
//      mask = 0x00FF;
      this.displayData[this.segmentColumn + offset] |= value & 0xFF;
//      this.displayData[this.segmentColumn + offset] |= value;
    }

//    const val = (this.displayData[offset] & ~mask) | value;
//    if (val)
//    console.log('_update', offset, val);
  }

  setRow1(isLow, value) {
    this._update(0, isLow, value);
  }

  setRow2(isLow, value) {
    this._update(16, isLow, value);
  }

  _drawChar(buffer, offset, value) {
/*
3 3 3 3 3 3 3
3 3 0 3 0 3 3
3 3 0 3 0 3 3
3 2 1 3 0 3 3
3 1 2 3 3 0 3
3 0 3 3 3 0 3
3 0 3 3 3 0 3
3 3 3 3 3 3 3
3 0 3 3 3 0 3
3 0 3 3 3 0 3
3 0 3 3 3 0 3
3 3 0 3 0 3 3
3 3 0 3 0 3 3
3 3 0 3 0 3 3
3 3 3 3 3 3 3
*/
  if (value & SEG_UPPER_LEFT_DIAGONAL) {
  }
  if (value & SEG_TOP) {
    buffer[offset] = 3;
    buffer[offset + 1] = 3;
    buffer[offset + 2] = 3;
    buffer[offset + 3] = 3;
    buffer[offset + 4] = 3;
    buffer[offset + 5] = 3;
    buffer[offset + 6] = 3;
  }
  if (value & SEG_BOTTOM) {
    buffer[OFFSET_BOTTOM + offset] = 3;
    buffer[OFFSET_BOTTOM + offset + 1] = 3;
    buffer[OFFSET_BOTTOM + offset + 2] = 3;
    buffer[OFFSET_BOTTOM + offset + 3] = 3;
    buffer[OFFSET_BOTTOM + offset + 4] = 3;
    buffer[OFFSET_BOTTOM + offset + 5] = 3;
    buffer[OFFSET_BOTTOM + offset + 6] = 3;
  }
  if (value & SEG_MIDDLE_LEFT) {
    buffer[OFFSET_MIDDLE + offset] = 3;
    buffer[OFFSET_MIDDLE + offset + 1] = 3;
    buffer[OFFSET_MIDDLE + offset + 2] = 3;
    buffer[OFFSET_MIDDLE + offset + 3] = 3;
  }
  if (value & SEG_MIDDLE_RIGHT) {
    buffer[OFFSET_MIDDLE + 3 + offset] = 3;
    buffer[OFFSET_MIDDLE + 4 + offset] = 3;
    buffer[OFFSET_MIDDLE + 4 + offset + 1] = 3;
    buffer[OFFSET_MIDDLE + 4 + offset + 2] = 3;
  }
  
  if (value & SEG_VERT_TOP) {
    buffer[offset + 3] = 3;
    buffer[offset + 3 + 1 * OFFSET_LINE] = 3;
    buffer[offset + 3 + 2 * OFFSET_LINE] = 3;
    buffer[offset + 3 + 3 * OFFSET_LINE] = 3;
    buffer[offset + 3 + 4 * OFFSET_LINE] = 3;
    buffer[offset + 3 + 5 * OFFSET_LINE] = 3;
    buffer[offset + 3 + 6 * OFFSET_LINE] = 3;
    buffer[offset + 3 + 7 * OFFSET_LINE] = 3;
  }
  if (value & SEG_VERT_BOT) {
    const EIGHT_LINES = OFFSET_LINE * 7;
    buffer[EIGHT_LINES + offset + 3] = 3;
    buffer[EIGHT_LINES + offset + 3 + 1 * OFFSET_LINE] = 3;
    buffer[EIGHT_LINES + offset + 3 + 2 * OFFSET_LINE] = 3;
    buffer[EIGHT_LINES + offset + 3 + 3 * OFFSET_LINE] = 3;
    buffer[EIGHT_LINES + offset + 3 + 4 * OFFSET_LINE] = 3;
    buffer[EIGHT_LINES + offset + 3 + 5 * OFFSET_LINE] = 3;
    buffer[EIGHT_LINES + offset + 3 + 6 * OFFSET_LINE] = 3;
    buffer[EIGHT_LINES + offset + 3 + 7 * OFFSET_LINE] = 3;
  }

  if (value & SEG_UPPER_LEFT) {
    buffer[offset] = 3;
    buffer[offset + 1 * OFFSET_LINE] = 3;
    buffer[offset + 2 * OFFSET_LINE] = 3;
    buffer[offset + 3 * OFFSET_LINE] = 3;
    buffer[offset + 4 * OFFSET_LINE] = 3;
    buffer[offset + 5 * OFFSET_LINE] = 3;
    buffer[offset + 6 * OFFSET_LINE] = 3;
    buffer[offset + 7 * OFFSET_LINE] = 3;
  }
  if (value & SEG_LOWER_LEFT) {
    buffer[OFFSET_MIDDLE + offset] = 3;
    buffer[OFFSET_MIDDLE + offset + 1 * OFFSET_LINE] = 3;
    buffer[OFFSET_MIDDLE + offset + 2 * OFFSET_LINE] = 3;
    buffer[OFFSET_MIDDLE + offset + 3 * OFFSET_LINE] = 3;
    buffer[OFFSET_MIDDLE + offset + 4 * OFFSET_LINE] = 3;
    buffer[OFFSET_MIDDLE + offset + 5 * OFFSET_LINE] = 3;
    buffer[OFFSET_MIDDLE + offset + 6 * OFFSET_LINE] = 3;
    buffer[OFFSET_MIDDLE + offset + 7 * OFFSET_LINE] = 3;
  }
  if (value & SEG_UPPER_RIGHT) {
    buffer[6 + offset] = 3;
    buffer[6 + offset + 1 * OFFSET_LINE] = 3;
    buffer[6 + offset + 2 * OFFSET_LINE] = 3;
    buffer[6 + offset + 3 * OFFSET_LINE] = 3;
    buffer[6 + offset + 4 * OFFSET_LINE] = 3;
    buffer[6 + offset + 5 * OFFSET_LINE] = 3;
    buffer[6 + offset + 6 * OFFSET_LINE] = 3;
    buffer[6 + offset + 7 * OFFSET_LINE] = 3;
  }
  if (value & SEG_LOWER_RIGHT) {
    buffer[6 + OFFSET_MIDDLE + offset] = 3;
    buffer[6 + OFFSET_MIDDLE + offset + 1 * OFFSET_LINE] = 3;
    buffer[6 + OFFSET_MIDDLE + offset + 2 * OFFSET_LINE] = 3;
    buffer[6 + OFFSET_MIDDLE + offset + 3 * OFFSET_LINE] = 3;
    buffer[6 + OFFSET_MIDDLE + offset + 4 * OFFSET_LINE] = 3;
    buffer[6 + OFFSET_MIDDLE + offset + 5 * OFFSET_LINE] = 3;
    buffer[6 + OFFSET_MIDDLE + offset + 6 * OFFSET_LINE] = 3;
    buffer[6 + OFFSET_MIDDLE + offset + 7 * OFFSET_LINE] = 3;
  }
  if (value & SEG_LOWER_RIGHT_DIAGONAL) {
    buffer[128 * 8 + 3 + offset] = 3;
    buffer[128 * 8 + 4 + offset] = 2;
    buffer[128 * 9 + 4 + offset] = 3;
    buffer[128 * 10 + 4 + offset] = 2;
    buffer[128 * 10 + 5 + offset] = 1;
    buffer[128 * 11 + 4 + offset] = 1;
    buffer[128 * 11 + 5 + offset] = 2;
    buffer[128 * 12 + 5 + offset] = 3;
    buffer[128 * 12 + 6 + offset] = 1;
    buffer[128 * 13 + 5 + offset] = 1;
    buffer[128 * 13 + 6 + offset] = 3;
    buffer[128 * 14 + 6 + offset] = 3;
  }
}

  // a pixel can have 0%/33%/66%/100% Intensity depending on the display time the last 3 frames
  // input: 512 bytes, one pixel uses 1 bit: 0=off, 1=on
  // output: 4096 bytes, one pixel uses 1 byte: 0=off, 1=33%, 2=66%, 3=100%
  getShadedOutputVideoFrame() {
    const videoBufferShaded = new Uint8Array(this.dmdPageSize).fill(0);

    for (let n = 0; n < 16; n++) {
      this._drawChar(videoBufferShaded, n * CHAR_WITH, this.displayData[n]);
    }
    for (let n = 16; n < 32; n++) {
      this._drawChar(videoBufferShaded, 128 + OFFSET_BOTTOM + n * CHAR_WITH, this.displayData[n]);
    }

    return videoBufferShaded;
  }
}
