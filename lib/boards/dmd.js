'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:dmd');

// 128x32 pixels -> total 4096(0x1000) pixel. packed 512(0x200) bytes

//  wpcemu:boards:dmd R_NOT_IMPLEMENTED 0x3d61 0 +2ms

const OP = {
  WPC_DMD_HIGH_PAGE: 0x3FBC,
  WPC_DMD_SCANLINE: 0x3FBD,
  WPC_DMD_LOW_PAGE: 0x3FBE,
  WPC_DMD_ACTIVE_PAGE: 0x3FBF,
};

const DMD_PAGE_HIGH_ADDRESS = 0x3A00;
const DMD_PAGE_LOW_ADDRESS = 0x3C00;

// 128 * 32
const DMD_PAGE_SIZE = 0x200;
const DMD_PACKED_SCANLINE_SIZE = 16;
const DMD_NR_OF_PAGES = 16;
const DMD_SHADING_FRAMES = 3;

const REVERSEOP = [];
Object.keys(OP).forEach((key) => {
  REVERSEOP[OP[key]] = key;
});

module.exports = {
  getInstance
};

function getInstance(initObject) {
  return new DMD(initObject);
}

class DMD {

  constructor(initObject) {
    this.interruptCallback = initObject.interruptCallback;
    this.ram = initObject.ram;

    // DMD has its own 8kb video ram to hold 16 pages of video frames, per byte we store 8 pixels
    this.videoRam = new Uint8Array(DMD_PAGE_SIZE * DMD_NR_OF_PAGES).fill(0);
    // the video pages the CPU has access to
    this.lowPage = 0;
    this.highPage = 1;

    this.scanline = 0;
    this.activePage = 0;
    // if CPU requested to switch the active page - this holds the new page, will be flipped when scanline is 0
    this.nextActivePage = undefined;

    // we use 3 different frames for the active page - to implement shading
    this.videoOutputPointer = 0;
    this.videoOutputBuffer = new Uint8Array(DMD_SHADING_FRAMES * DMD_PAGE_SIZE).fill(0);
    this.videoOutputBufferShaded = new Uint8Array(DMD_PAGE_SIZE).fill(0);
  }

  _getShadedOutputVideoFrame() {
    const BUFFER0 = 0;
    const BUFFER1 = DMD_PAGE_SIZE;
    const BUFFER2 = DMD_PAGE_SIZE * 2;
    var output = 0;
    if (1===1) {
      return this.videoOutputBuffer
        .slice(this.videoOutputPointer * DMD_PAGE_SIZE, this.videoOutputPointer * DMD_PAGE_SIZE + DMD_PAGE_SIZE);
    }
      /* Create a temporary buffer with all pixels */
      for (var kk = 0, ii = 1; ii < 33; ii++) {
        for (var jj = 0; jj < 16; jj++) {
          /* Intensity depends on how many times the pixel */
          /* been on in the last 3 frames                  */
          const intens1 = (this.videoOutputBuffer[BUFFER0 + kk] & 0x55) +
                          (this.videoOutputBuffer[BUFFER1 + kk] & 0x55) +
                          (this.videoOutputBuffer[BUFFER2 + kk] & 0x55);
          const intens2 = (this.videoOutputBuffer[BUFFER0 + kk] & 0xaa) +
                          (this.videoOutputBuffer[BUFFER1 + kk] & 0xaa) +
                          (this.videoOutputBuffer[BUFFER2 + kk] & 0xaa);

          this.videoOutputBufferShaded[output++] = (intens1)    & 0x03;
          this.videoOutputBufferShaded[output++] = (intens2>>1) & 0x03;
          this.videoOutputBufferShaded[output++] = (intens1>>2) & 0x03;
          this.videoOutputBufferShaded[output++] = (intens2>>3) & 0x03;
          this.videoOutputBufferShaded[output++] = (intens1>>4) & 0x03;
          this.videoOutputBufferShaded[output++] = (intens2>>5) & 0x03;
          this.videoOutputBufferShaded[output++] = (intens1>>6) & 0x03;
          this.videoOutputBufferShaded[output++] = (intens2>>7) & 0x03;
          kk +=1;
        }
      }
      return this.videoOutputBufferShaded;
  }

  getUiState() {
    return {
      scanline: this.scanline,
      lowpage: this.lowPage,
      highpage: this.highPage,
      activepage: this.activePage,
      videoRam: this.videoRam,
      dmdDisplay: this._getShadedOutputVideoFrame()
    };
  }

  executeCycle() {
    // copy a scanline from the activePage to the output video buffer
    const sourceAddress = this.activePage * DMD_PAGE_SIZE + this.scanline * DMD_PACKED_SCANLINE_SIZE;
    const destinationAddress = this.videoOutputPointer * DMD_PAGE_SIZE + this.scanline * DMD_PACKED_SCANLINE_SIZE;
    for (var i = 0; i < 16; i++) {
      this.videoOutputBuffer[destinationAddress + i] = this.videoRam[sourceAddress + i];
    }

    this.scanline = (this.scanline + 1) & 0x1f;

    // framebuffer switch
    if (this.scanline === 0) {
      // flip output buffer, needed to calculate shading
      this.videoOutputPointer = (this.videoOutputPointer + 1) % DMD_SHADING_FRAMES;
      if (this.nextActivePage || this.nextActivePage === 0) {
        this.activePage = this.nextActivePage;
      }
    }

    // generate FIRQ if requested
    if (this.scanline === this.ram[OP.WPC_DMD_SCANLINE] & 0x1f) {
      if (this.requestFIRQ) {
        this.interruptCallback.firqFromDmd();
      }
    }
  }

  _getLowPageOffset(offset) {
    const deltaLow = offset - 0x3800;
    return this.lowPage * DMD_PAGE_SIZE + deltaLow;
  }

  _getHighPageOffset(offset) {
    const deltaHigh = offset - 0x3A00;
    return this.highPage * DMD_PAGE_SIZE + deltaHigh;
  }

  write(offset, value) {
    var _ofs;
    if (offset < DMD_PAGE_LOW_ADDRESS) {
      debug('WRITE DMD_PAGE_LOW', value);
      _ofs = this._getLowPageOffset(offset);
      this.videoRam[_ofs] = value;
      return;
    }
    if (offset < DMD_PAGE_HIGH_ADDRESS) {
      debug('WRITE DMD_PAGE_HIGH', value);
      _ofs = this._getHighPageOffset(offset);
      this.videoRam[_ofs] = value;
      return;
    }

    this.ram[offset] = value;

    switch (offset) {
      case OP.WPC_DMD_SCANLINE:
        debug('WRITE', REVERSEOP[offset], value);
        console.log('WRITE', REVERSEOP[offset], value);
        // The CPU can also write to WPC_DMD_SCANLINE to request an FIRQ interrupt to be generated when the current scanline reaches a certain value.
        // This is used to implement shading: the active page buffer is rapidly changed between different bit planes at different frequencies to simulate color.
        // Because there is latency between the time that FIRQ is generated and the CPU can respond to it, this writable register can compensate for that delay
        // and help to ensure that flipping occurs as fast as possible.
        this.requestFIRQ = true;
        break;

      case OP.WPC_DMD_ACTIVE_PAGE:
        debug('WRITE', REVERSEOP[offset], value);
        // The visible page register, WPC_DMD_ACTIVE_PAGE, holds the page number of the frame that should
        // be clocked to the display. Writing to this register does not take effect immediately but instead
        // at the beginning of the next vertical retrace.
        this.nextActivePage = value & 0xf;
        break;

      case OP.WPC_DMD_LOW_PAGE:
        this.lowPage = value & 0xf;
        debug('WRITE', REVERSEOP[offset], this.lowPage);
        break;

      case OP.WPC_DMD_HIGH_PAGE:
        this.highPage = value & 0xf;
        debug('WRITE', REVERSEOP[offset], this.highPage);
        break;

      default:
        debug('W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        console.log('DMD W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  read(offset) {
    var _ofs;
    if (offset < DMD_PAGE_LOW_ADDRESS) {
      _ofs = this._getLowPageOffset(offset);
      debug('READ DMD_PAGE_LOW', '0x' + offset.toString(16));
      return this.videoRam[_ofs];
    }
    if (offset < DMD_PAGE_HIGH_ADDRESS) {
      _ofs = this._getHighPageOffset(offset);
      debug('READ DMD_PAGE_HIGH', '0x' + offset.toString(16));
      return this.videoRam[_ofs];
    }

    switch (offset) {
      case OP.WPC_DMD_SCANLINE:
        debug('READ', REVERSEOP[offset], this.highPage);
        return this.scanline;

      default:
        debug('R_NOT_IMPLEMENTED', '0x' + offset.toString(16), this.ram[offset]);
        console.log('DMD R_NOT_IMPLEMENTED', '0x' + offset.toString(16), this.ram[offset]);
        return this.ram[offset];
    }
  }
}
/*

+
In the second generation, the alphanumerics are replaced by a dot matrix controller/display (DMD),
which has 128x32 pixels. The display expects a serial bitstream and must be continously refreshed.
The controller board stores up to 16 frames in its own RAM and handles the refresh.
It connects to the main CPU board which writes the data. The display refreshes at 122Mhz.

The controller fetches 1 byte (8 pixels) every 32 CPU cycles (16 microseconds). At this rate, it takes
256 microseconds per row and a little more than 8 milliseconds per complete frame. Thus, the refresh
rate is about 122MHz.

DMD R_NOT_IMPLEMENTED 0x3d61 0

/ ------------------------
/  DMD display registers
/-------------------------
#define DMD_PAGE3000    (0x3fb9 - WPC_BASE)
#define DMD_PAGE3200    (0x3fb8 - WPC_BASE)
#define DMD_PAGE3400    (0x3fbb - WPC_BASE)
#define DMD_PAGE3600    (0x3fba - WPC_BASE)
#define DMD_PAGE3A00    (0x3fbc - WPC_BASE)
#define DMD_PAGE3800    (0x3fbe - WPC_BASE)
#define DMD_VISIBLEPAGE (0x3fbf - WPC_BASE)
#define DMD_FIRQLINE    (0x3fbd - WPC_BASE)

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
