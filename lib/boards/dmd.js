'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:dmd');
const dmdBlend = require('./lib/dmd-blend');

// 128x32 pixels -> total 4096(0x1000) pixel. packed 512(0x200) bytes

const OP = {
  WPC_DMD_HIGH_PAGE: 0x3FBC,
  WPC_DMD_SCANLINE: 0x3FBD,
  WPC_DMD_LOW_PAGE: 0x3FBE,
  WPC_DMD_ACTIVE_PAGE: 0x3FBF,
};

const DMD_PAGE_1_ADDRESS = 0x3A00;
const DMD_PAGE_2_ADDRESS = 0x3FBC;
const DMD_PAGE1_START = 0x3800;
const DMD_PAGE2_START = 0x3A00;
const DMD_PAGE_SIZE = 0x200;

const REVERSEOP = [];
Object.keys(OP).forEach((key) => {
  REVERSEOP[OP[key]] = key;
});

module.exports = {
  getInstance
};

function getInstance(interruptCallback) {
  return new DMD(interruptCallback);
}

class DMD {

  constructor(interruptCallback) {
    this.interruptCallback = interruptCallback;
    //TODO waste of memory
    this.hardwareRam = new Uint8Array(0x4000).fill(0);
    this.activePlaneTracker = [];
  }


  getUiState() {
    const page1 = Uint8Array.from(this.hardwareRam.slice(DMD_PAGE1_START, DMD_PAGE1_START+DMD_PAGE_SIZE));
    const page2 = Uint8Array.from(this.hardwareRam.slice(DMD_PAGE2_START, DMD_PAGE2_START+DMD_PAGE_SIZE));
    const activePlaneTracker = dmdBlend.calc(
      this.activePlaneTracker.push({ event: 'end', ts: performance.now() })
    );
    this.activePlaneTracker = [];
    return {
      scanline: this.hardwareRam[OP.WPC_DMD_SCANLINE],
      lowpage: this.hardwareRam[OP.WPC_DMD_LOW_PAGE],
      highpage: this.hardwareRam[OP.WPC_DMD_HIGH_PAGE],
      activepage: this.hardwareRam[OP.WPC_DMD_ACTIVE_PAGE],
      page1,
      page2,
      activePlaneTracker,
    };
  }

  write(offset, value) {
    this.hardwareRam[offset] = value;
    if (offset < DMD_PAGE_1_ADDRESS) {
      debug('WRITE DMD_PAGE_1', value);
      return;
    }
    if (offset < DMD_PAGE_2_ADDRESS) {
      debug('WRITE DMD_PAGE_2', value);
      return;
    }

    switch (offset) {
      case OP.WPC_DMD_SCANLINE:
        debug('WRITE', REVERSEOP[offset], value);
        // TODO calling firq will cause the machine to stop
        // this.interruptCallback.firq();
        break;

      case OP.WPC_DMD_ACTIVE_PAGE:
      // The visible page register, WPC_DMD_ACTIVE_PAGE, holds the page number of the frame that should
      // be clocked to the display. Writing to this register does not take effect immediately but instead
      // at the beginning of the next vertical retrace.        if (this.activePlaneTracker.length < 50) {
        if (this.activePlaneTracker.length < 50) {
          this.activePlaneTracker.push({ plane: value & 0xf, ts: performance.now() });
        }
        // fallthrough

      case OP.WPC_DMD_HIGH_PAGE:
      case OP.WPC_DMD_LOW_PAGE:
        this.hardwareRam[offset] = value & 0xf;
        debug('WRITE', REVERSEOP[offset], this.hardwareRam[offset]);
        break;

      default:
        debug('W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  read(offset) {
    if (offset < DMD_PAGE_1_ADDRESS) {
      debug('READ DMD_PAGE_1', '0x' + offset.toString(16));
      return this.hardwareRam[offset];
    }
    if (offset < DMD_PAGE_2_ADDRESS) {
      debug('READ DMD_PAGE_2', '0x' + offset.toString(16));
      return this.hardwareRam[offset];
    }

    switch (offset) {
      case OP.WPC_DMD_SCANLINE:
        //TODO
        return 0x0;//ff;

      default:
        debug('R_NOT_IMPLEMENTED', '0x' + offset.toString(16), this.hardwareRam[offset]);
        return this.hardwareRam[offset];
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
