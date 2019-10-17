'use strict';

/*
Williams part numbers A-14039
128x32 pixels -> total 4096(0x1000) pixel. packed 512(0x200) bytes
NOTE: ALWAYS test STTNG when this file is changed!

In the second generation, the alphanumerics are replaced by a dot matrix controller/display (DMD),
which has 128x32 pixels. The display expects a serial bitstream and must be continously refreshed.
The controller board stores up to 16 frames in its own RAM and handles the refresh.
It connects to the main CPU board which writes the data. The display refreshes at 122Mhz.

The controller fetches 1 byte (8 pixels) every 32 CPU cycles (16 microseconds). At this rate, it takes
256 microseconds per row and a little more than 8 milliseconds per complete frame. Thus, the refresh
rate is about 122MHz.

$3800-$39FF	    DMD Page 1
$3A00-$3BFF	    DMD Page 2
$3FBC-$3FBF	    DMD display control
                Address	  Format	 Description
                $3FBC     Byte     WPC_DMD_HIGH_PAGE
                                    3-0: W: The page of display RAM mapped into the 2nd (6th on WPC95) region,
                                    from 0x3A00-0x3BFF.
                $3FBD     Byte     WPC_DMD_SCANLINE aka DMD_FIRQLINE
                                    7-0: W: Request an FIRQ after a particular scanline is drawn
                                    5-0: R: The last scanline that was drawn
                $3FBE     Byte     WPC_DMD_LOW_PAGE
                                    3-0: W: The page of display RAM mapped into the 1st (5th on WPC95) region,
                                    from 0x3800-0x39FF.
                $3FBF     Byte     WPC_DMD_ACTIVE_PAGE aka DMD_VISIBLEPAGE
                                    3-0: W: The page of display RAM to be used for refreshing the display.
                                    Writes to this register take effect just prior to drawing scanline 0.
*/

const debug = require('debug')('wpcemu:boards:elements:outputDmdDisplay');
const timing = require('../static/timing');
const bitmagic = require('./bitmagic');

const DMD_WINDOW_HEIGHT = 32;
const DMD_WINDOW_WIDTH_IN_BYTES = (128 / 8);

const DMD_SCANLINE_SIZE_IN_BYTES = 16;
const DMD_SHADING_FRAMES = 3;
const DMD_MAXIMAL_SCANLINE = 0x1F;
const DMD_NR_OF_PAGES = 16;

module.exports = {
  getInstance,
};

function getInstance(dmdPageSize) {
  return new OutputDmdDisplay(dmdPageSize);
}

class OutputDmdDisplay {
  constructor(dmdPageSize) {
    this.dmdPageSize = dmdPageSize;
    this.shadedVideoBuffer = new Uint8Array(dmdPageSize * DMD_SHADING_FRAMES).fill(0);
    this.shadedVideoBufferLatched = new Uint8Array(dmdPageSize * DMD_SHADING_FRAMES).fill(0);
    this.videoRam = new Uint8Array(dmdPageSize * DMD_NR_OF_PAGES).fill(0);

    this.dmdPageMapping = [ 0, 0, 0, 0, 0, 0 ];
    this.scanline = 0;
    this.activePage = 0;
    this.nextActivePage = undefined;
    this.videoOutputPointer = 0;
    this.requestFIRQ = true;
    this.ticksUpdateDmd = 0;
  }

  executeCycle(singleTicks) {
    this.ticksUpdateDmd += singleTicks;
    if (this.ticksUpdateDmd >= timing.CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS) {
      this.ticksUpdateDmd -= timing.CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS;
      this._copyScanline();
      return {
        requestFIRQ: this.requestFIRQ,
        scanline: this.scanline,
      };
    }
  }

  getState() {
    return {
      scanline: this.scanline,
      activepage: this.activePage,
      nextActivePage: this.nextActivePage,
      dmdPageMapping: this.dmdPageMapping,
      dmdShadedBuffer: this._getShadedOutputVideoFrame(),
      requestFIRQ: this.requestFIRQ,
      // NOTE: this might flicker, as video ram is not double buffered
      videoRam: this.videoRam,
      // use cached image, used to dump dmd frames
      videoOutputBuffer: this.shadedVideoBuffer,
      videoOutputPointer: this.videoOutputPointer,
      ticksUpdateDmd: this.ticksUpdateDmd,
    };
  }

  setState(displayState) {
    if (!displayState) {
      return false;
    }
    this.scanline = displayState.scanline;
    this.activepage = displayState.activepage;
    this.dmdPageMapping = displayState.dmdPageMapping;
    this.requestFIRQ = displayState.requestFIRQ === true;
    this.videoOutputPointer = displayState.videoOutputPointer;
    this.ticksUpdateDmd = displayState.ticksUpdateDmd;
    this.setNextActivePage(displayState.nextActivePage);
    if (typeof displayState.videoRam === 'object') {
      this.videoRam = Uint8Array.from(displayState.videoRam);
    }
  }

  selectDmdPage(bank, value) {
    const page = value & 0x0F;
    debug('_selectDmdPage %o', { bank, page });
    this.dmdPageMapping[bank] = page;
  }

  setNextActivePage(value) {
    this.nextActivePage = value & 0xF;
  }

  _getVideoRamOffset(bank, offset) {
    const selectedPage = this.dmdPageMapping[bank];
    return selectedPage * this.dmdPageSize + offset;
  }

  writeVideoRam(bank, offset, value) {
    const videoRamOffset = this._getVideoRamOffset(bank, offset);
    this.videoRam[videoRamOffset] = value;
  }

  readVideoRam(bank, offset) {
    const videoRamOffset = this._getVideoRamOffset(bank, offset);
    return this.videoRam[videoRamOffset];
  }

  _copyScanline() {
    // copy a scanline from the activePage to the output video buffer
    const sourceAddress = this.activePage * this.dmdPageSize + this.scanline * DMD_SCANLINE_SIZE_IN_BYTES;
    const destinationAddress = this.videoOutputPointer * this.dmdPageSize + this.scanline * DMD_SCANLINE_SIZE_IN_BYTES;
    for (let i = 0; i < DMD_SCANLINE_SIZE_IN_BYTES; i++) {
      this.shadedVideoBuffer[destinationAddress + i] = this.videoRam[sourceAddress + i];
    }

    // select next scanline
    this.scanline = (this.scanline + 1) & DMD_MAXIMAL_SCANLINE;

    // framebuffer switch
    if (this.scanline === 0) {
      // flip output buffer, needed to calculate shading
      this.videoOutputPointer = (this.videoOutputPointer + 1) % DMD_SHADING_FRAMES;
      this.shadedVideoBufferLatched = new Uint8Array(this.shadedVideoBuffer);

      if (Number.isInteger(this.nextActivePage)) {
        this.activePage = this.nextActivePage;
        this.nextActivePage = undefined;
      }
    }
  }

  // a pixel can have 0%/33%/66%/100% Intensity depending on the display time the last 3 frames
  // input: 512 bytes, one pixel uses 1 bit: 0=off, 1=on
  // output: 4096 bytes, one pixel uses 1 byte: 0=off, 1=33%, 2=66%, 3=100%
  _getShadedOutputVideoFrame() {
    const OFFSET_BUFFER0 = 0;
    const OFFSET_BUFFER1 = this.dmdPageSize;
    const OFFSET_BUFFER2 = this.dmdPageSize * 2;
    // output is 8 times larger (1 pixel uses 1 byte)
    const videoBufferShaded = new Uint8Array(8 * this.dmdPageSize).fill(0);

    let outputOffset = 0;
    let inputOffset = 0;
    for (let scanline = 0; scanline < DMD_WINDOW_HEIGHT; scanline++) {
      for (let eightPixelsOffset = 0; eightPixelsOffset < DMD_WINDOW_WIDTH_IN_BYTES; eightPixelsOffset++) {
        for (let i = 0; i < 8; i++) {
          const bitMask = bitmagic.setMsbBit(i);
          const intensity = ((this.shadedVideoBufferLatched[OFFSET_BUFFER0 + inputOffset] & bitMask) > 0 ? 1 : 0) +
                            ((this.shadedVideoBufferLatched[OFFSET_BUFFER1 + inputOffset] & bitMask) > 0 ? 1 : 0) +
                            ((this.shadedVideoBufferLatched[OFFSET_BUFFER2 + inputOffset] & bitMask) > 0 ? 1 : 0);
          videoBufferShaded[outputOffset++] = intensity;
        }
        inputOffset++;
      }
    }
    return videoBufferShaded;
  }

}
