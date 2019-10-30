'use strict';

const debug = require('debug')('wpcemu:boards:elements:outputAlphaDisplay');
const timing = require('../static/timing');

/**
 * Emulates 2x 16-character alphanumeric displays, Each character is comprised of 14 line segments, a comma, and a period.
 * Renders in DMD Display buffer (128 x 32)
 * Segment height is 15 pixel, segment width is 7 pixel:
 * Williams part # D-12793
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

  3 3 3 3 3
  3 0 3 0 3
  3 3 3 3 3
  3 3 3 3 3
  3 0 3 0 3
  3 3 3 3 3
  3 0 3 0 3
  3 3 3 3 3
  3 3 3 3 3
  3 0 3 0 3 0 0
  3 3 3 3 3 0 3
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
const CHAR_HEIGHT = 11;

const OFFSET_LINE = 128;
const OFFSET_BOTTOM = OFFSET_LINE * (CHAR_HEIGHT - 1);
const OFFSET_MIDDLE = OFFSET_LINE * 5;

class OutputAlphaDisplay {

  constructor(dmdPageSize) {
    // 1 pixel uses 1 byte
    this.dmdPageSize = dmdPageSize * 8;
    this.segmentColumn = 0;
    this.ticksUpdateAlpha = 0;
    this.displayData = new Uint16Array(16 * 2).fill(0);
    this.displayDataLatched = new Uint16Array(16 * 2).fill(0);
  }

  getState() {
    return {
      scanline: this.segmentColumn,
      dmdShadedBuffer: this._getShadedOutputVideoFrame(),
      dmdPageMapping: [0, 0],
    };
  }

  setState(displayState) {
    if (!displayState) {
      return false;
    }
    this.segmentColumn = displayState.scanline;
  }

  setSegmentColumn(value) {
    this.segmentColumn = value & 0x0F;
    debug('setSegmentColumn', this.segmentColumn);
  }

  executeCycle(singleTicks) {
    this.ticksUpdateAlpha += singleTicks;
    if (this.ticksUpdateAlpha >= timing.UPDATE_ALPHANUMERIC_DISPLAY_TICKS) {
      this.displayDataLatched = Uint16Array.from(this.displayData);
      this.displayData.fill(0);
      this.ticksUpdateAlpha = 0;
    }
  }

  _update(offset, isLow, value) {
    if (isLow) {
      /* Uppermost word of 16-bit reg requires shifting value
      up by 8 bits.  Uppermost 8-bits will be cleared first. */
      this.displayData[this.segmentColumn + offset] |= (value << 8) & 0xFF00;
    } else {
      /* Lower 8-bits need to be cleared first */
      this.displayData[this.segmentColumn + offset] |= value & 0xFF;
    }
  }

  setRow1(isLow, value) {
    this._update(0, isLow, value);
  }

  setRow2(isLow, value) {
    this._update(16, isLow, value);
  }

  _drawChar(buffer, offset, value) {
    let pos;
    if (value & SEG_TOP) {
      buffer[offset] = 3;
      buffer[offset + 1] = 3;
      buffer[offset + 2] = 3;
      buffer[offset + 3] = 3;
      buffer[offset + 4] = 3;
    }
    if (value & SEG_BOTTOM) {
      pos = OFFSET_BOTTOM + offset;
      buffer[pos] = 3;
      buffer[pos + 1] = 3;
      buffer[pos + 2] = 3;
      buffer[pos + 3] = 3;
      buffer[pos + 4] = 3;
    }
    if (value & SEG_PERIOD) {
      buffer[OFFSET_BOTTOM + offset + 6] = 3;
    }
    if (value & SEG_COMMA) {
      buffer[OFFSET_LINE + OFFSET_BOTTOM + offset + 6] = 2;
    }
    if (value & SEG_MIDDLE_LEFT) {
      pos = OFFSET_MIDDLE + offset;
      buffer[pos] = 3;
      buffer[pos + 1] = 3;
      buffer[pos + 2] = 3;
    }
    if (value & SEG_MIDDLE_RIGHT) {
      pos = OFFSET_MIDDLE + offset + 2;
      buffer[pos] = 3;
      buffer[pos + 1] = 3;
      buffer[pos + 2] = 3;
    }
    if (value & SEG_VERT_TOP) {
      pos = offset + 2;
      buffer[pos] = 3;
      buffer[pos + 1 * OFFSET_LINE] = 3;
      buffer[pos + 2 * OFFSET_LINE] = 3;
      buffer[pos + 3 * OFFSET_LINE] = 3;
      buffer[pos + 4 * OFFSET_LINE] = 3;
      buffer[pos + 5 * OFFSET_LINE] = 3;
    }
    if (value & SEG_VERT_BOT) {
      pos = OFFSET_MIDDLE + offset + 2;
      buffer[pos] = 3;
      buffer[pos + 1 * OFFSET_LINE] = 3;
      buffer[pos + 2 * OFFSET_LINE] = 3;
      buffer[pos + 3 * OFFSET_LINE] = 3;
      buffer[pos + 4 * OFFSET_LINE] = 3;
      buffer[pos + 5 * OFFSET_LINE] = 3;
    }
    if (value & SEG_UPPER_LEFT) {
      buffer[offset] = 3;
      buffer[offset + 1 * OFFSET_LINE] = 3;
      buffer[offset + 2 * OFFSET_LINE] = 3;
      buffer[offset + 3 * OFFSET_LINE] = 3;
      buffer[offset + 4 * OFFSET_LINE] = 3;
      buffer[offset + 5 * OFFSET_LINE] = 3;
    }
    if (value & SEG_LOWER_LEFT) {
      pos = OFFSET_MIDDLE + offset;
      buffer[pos] = 3;
      buffer[pos + 1 * OFFSET_LINE] = 3;
      buffer[pos + 2 * OFFSET_LINE] = 3;
      buffer[pos + 3 * OFFSET_LINE] = 3;
      buffer[pos + 4 * OFFSET_LINE] = 3;
      buffer[pos + 5 * OFFSET_LINE] = 3;
    }
    if (value & SEG_UPPER_RIGHT) {
      buffer[4 + offset] = 3;
      buffer[4 + offset + 1 * OFFSET_LINE] = 3;
      buffer[4 + offset + 2 * OFFSET_LINE] = 3;
      buffer[4 + offset + 3 * OFFSET_LINE] = 3;
      buffer[4 + offset + 4 * OFFSET_LINE] = 3;
      buffer[4 + offset + 5 * OFFSET_LINE] = 3;
    }
    if (value & SEG_LOWER_RIGHT) {
      pos = 4 + OFFSET_MIDDLE + offset;
      buffer[pos] = 3;
      buffer[pos + 1 * OFFSET_LINE] = 3;
      buffer[pos + 2 * OFFSET_LINE] = 3;
      buffer[pos + 3 * OFFSET_LINE] = 3;
      buffer[pos + 4 * OFFSET_LINE] = 3;
      buffer[pos + 5 * OFFSET_LINE] = 3;
    }
    if (value & SEG_UPPER_RIGHT_DIAGONAL) {
      buffer[OFFSET_LINE * 5 + 2 + offset] = 3;
      buffer[OFFSET_LINE * 4 + 2 + offset] = 3;
      buffer[OFFSET_LINE * 3 + 3 + offset] = 3;
      buffer[OFFSET_LINE * 2 + 3 + offset] = 3;
      buffer[OFFSET_LINE * 1 + 4 + offset] = 3;
      buffer[OFFSET_LINE * 0 + 4 + offset] = 3;
    }
    if (value & SEG_UPPER_LEFT_DIAGONAL) {
      buffer[OFFSET_LINE * 5 + 2 + offset] = 3;
      buffer[OFFSET_LINE * 4 + 2 + offset] = 3;
      buffer[OFFSET_LINE * 3 + 1 + offset] = 3;
      buffer[OFFSET_LINE * 2 + 1 + offset] = 3;
      buffer[OFFSET_LINE * 1 + 0 + offset] = 3;
      buffer[OFFSET_LINE * 0 + 0 + offset] = 3;
    }
    if (value & SEG_LOWER_RIGHT_DIAGONAL) {
      buffer[OFFSET_LINE * 5 + 2 + offset] = 3;
      buffer[OFFSET_LINE * 6 + 2 + offset] = 3;
      buffer[OFFSET_LINE * 7 + 3 + offset] = 3;
      buffer[OFFSET_LINE * 8 + 3 + offset] = 3;
      buffer[OFFSET_LINE * 9 + 4 + offset] = 3;
      buffer[OFFSET_LINE * 10 + 4 + offset] = 3;
    }
    if (value & SEG_LOWER_LEFT_DIAGONAL) {
      buffer[OFFSET_LINE * 5 + 2 + offset] = 3;
      buffer[OFFSET_LINE * 6 + 2 + offset] = 3;
      buffer[OFFSET_LINE * 7 + 1 + offset] = 3;
      buffer[OFFSET_LINE * 8 + 1 + offset] = 3;
      buffer[OFFSET_LINE * 9 + 0 + offset] = 3;
      buffer[OFFSET_LINE * 10 + 0 + offset] = 3;
    }
  }

  // a pixel can have 0%/33%/66%/100% Intensity depending on the display time the last 3 frames
  // input: 512 bytes, one pixel uses 1 bit: 0=off, 1=on
  // output: 4096 bytes, one pixel uses 1 byte: 0=off, 1=33%, 2=66%, 3=100%
  _getShadedOutputVideoFrame() {
    const videoBufferShaded = new Uint8Array(this.dmdPageSize).fill(0);

    for (let n = 0; n < 16; n++) {
      this._drawChar(videoBufferShaded, n * CHAR_WITH, this.displayDataLatched[n]);
    }
    for (let n = 16; n < 32; n++) {
      this._drawChar(videoBufferShaded, OFFSET_LINE * 16 + n * CHAR_WITH, this.displayDataLatched[n]);
    }

    return videoBufferShaded;
  }
}
