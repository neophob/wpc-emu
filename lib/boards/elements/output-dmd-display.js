'use strict';

const debug = require('debug')('wpcemu:boards:elements:outputDmdDisplay');
const bitmagic = require('./bitmagic');

const DMD_WINDOW_HEIGHT = 32;
const DMD_WINDOW_WIDTH_IN_BYTES = (128 / 8);

module.exports = {
  getInstance,
};

function getInstance(dmdPageSize, videoBuffer) {
  return new OutputDmdDisplay(dmdPageSize, videoBuffer);
}

class OutputDmdDisplay {
  constructor(dmdPageSize, videoBuffer) {
    this.dmdPageSize = dmdPageSize;
    this.videoBuffer = videoBuffer;
  }

  updateVideoBuffer(videoBuffer) {
    // clone video buffer
    debug('updateVideoBuffer');
    this.videoBuffer = new Uint8Array(videoBuffer);
  }

  // a pixel can have 0%/33%/66%/100% Intensity depending on the display time the last 3 frames
  // input: 512 bytes, one pixel uses 1 bit: 0=off, 1=on
  // output: 4096 bytes, one pixel uses 1 byte: 0=off, 1=33%, 2=66%, 3=100%
  getShadedOutputVideoFrame() {
    const OFFSET_BUFFER0 = 0;
    const OFFSET_BUFFER1 = this.dmdPageSize;
    const OFFSET_BUFFER2 = this.dmdPageSize * 2;
    // output is 8 times larger (1 pixel uses 1 byte)
    const videoBufferShaded = new Uint8Array(8 * this.dmdPageSize).fill(0);

    var outputOffset = 0;
    var inputOffset = 0;
    for (var scanline = 0; scanline < DMD_WINDOW_HEIGHT; scanline++) {
      for (var eightPixelsOffset = 0; eightPixelsOffset < DMD_WINDOW_WIDTH_IN_BYTES; eightPixelsOffset++) {
        for (var i = 0; i < 8; i++) {
          const bitMask = bitmagic.setMsbBit(i);
          const intensity = ((this.videoBuffer[OFFSET_BUFFER0 + inputOffset] & bitMask) > 0 ? 1 : 0) +
                            ((this.videoBuffer[OFFSET_BUFFER1 + inputOffset] & bitMask) > 0 ? 1 : 0) +
                            ((this.videoBuffer[OFFSET_BUFFER2 + inputOffset] & bitMask) > 0 ? 1 : 0);
          videoBufferShaded[outputOffset++] = intensity;
        }
        inputOffset++;
      }
    }
    return videoBufferShaded;
  }

}
