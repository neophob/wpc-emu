'use strict';

const debug = require('debug')('wpcemu:boards:dmd');

const OP = {
  WPC_DMD_HIGH_PAGE: 0x3FBC,
  WPC_DMD_SCANLINE: 0x3FBD,
  WPC_DMD_LOW_PAGE: 0x3FBE,
  WPC_DMD_ACTIVE_PAGE: 0x3FBF,
};

const DMD_PAGE_1_ADDRESS = 0x3A00;
const DMD_PAGE_2_ADDRESS = 0x3FBC;

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
    this.genericState = new Array(0x4000).fill(0);
  }

  write(offset, value) {
    this.genericState[offset] = value;
    if (offset < DMD_PAGE_1_ADDRESS) {
      debug('WRITE DMD_PAGE_1_MAXIMAL_ADDRESS', value);
      return;
    }
    if (offset < DMD_PAGE_2_ADDRESS) {
      debug('WRITE DMD_PAGE_2_MAXIMAL_ADDRESS', value);
      return;
    }

    switch (offset) {
      case OP.WPC_DMD_HIGH_PAGE:
      case OP.WPC_DMD_SCANLINE:
      case OP.WPC_DMD_LOW_PAGE:
      case OP.WPC_DMD_ACTIVE_PAGE:
        debug('WRITE', REVERSEOP[offset], value);
        break;

      default:
        debug('W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  read(offset) {
    switch (offset) {
      case OP.WPC_DMD_SCANLINE:
        return 0x0;//ff;

      default:
        debug('R_NOT_IMPLEMENTED', '0x' + offset.toString(16), this.genericState[offset]);
        return this.genericState[offset];
    }
  }
}
/*
$3800-$39FF	    DMD Page 1
$3A00-$3BFF	    DMD Page 2
$3FBC-$3FBF	    DMD display control
                Address	  Format	 Description
                $3FBC     Byte     WPC_DMD_HIGH_PAGE
                                    3-0: W: The page of display RAM mapped into the 2nd (6th on WPC95) region, from 0x3A00-0x3BFF.
                $3FBD     Byte     WPC_DMD_SCANLINE
                                    7-0: W: Request an FIRQ after a particular scanline is drawn
                                    5-0: R: The last scanline that was drawn
                $3FBE     Byte     WPC_DMD_LOW_PAGE
                                    3-0: W: The page of display RAM mapped into the 1st (5th on WPC95) region, from 0x3800-0x39FF.
                $3FBF     Byte     WPC_DMD_ACTIVE_PAGE
                                    3-0: W: The page of display RAM to be used for refreshing the display.
                                    Writes to this register take effect just prior to drawing scanline 0.

*/
