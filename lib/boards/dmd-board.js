'use strict';

// Williams part numbers A-14039
// 128x32 pixels -> total 4096(0x1000) pixel. packed 512(0x200) bytes

const debug = require('debug')('wpcemu:boards:dmd');
const dmdMapper = require('./mapper/dmd.js');
const outputDmdDisplay = require('./elements/output-dmd-display');

const OP = {
  //TODO move me away here
  FREEWPC_DEBUG_CONTROL_PORT: 0x3D61,
  WPC_SERIAL_CONTROL_PORT: 0x3E66,
  WPC95_PRINTER_DATA: 0x3FB0,
  WPC95_PRINTER_BAUD: 0x3FB1,
  WPC95_PRINTER_ADDR: 0x3FB3,
  WPC95_PRINTER_STATUS: 0x3FB5,
  WPC95_PRINTER_PRESENCE: 0x3FB7,

  WPC95_DMD_PAGE3000: 0x3FB9,
  WPC95_DMD_PAGE3200: 0x3FB8,
  WPC95_DMD_PAGE3400: 0x3FBB,
  WPC95_DMD_PAGE3600: 0x3FBA,

  //AKA WPC95_DMD_PAGE3A00
  WPC_DMD_HIGH_PAGE: 0x3FBC,

  //AKA DMD_FIRQLINE
  WPC_DMD_SCANLINE: 0x3FBD,

  //AKA WPC95_DMD_PAGE3800
  WPC_DMD_LOW_PAGE: 0x3FBE,
  WPC_DMD_ACTIVE_PAGE: 0x3FBF,
};

// 128 * 32
const DMD_PAGE_SIZE = 0x200;
const DMD_SCANLINE_SIZE_IN_BYTES = 16;
const DMD_NR_OF_PAGES = 16;
const DMD_SHADING_FRAMES = 3;

const REVERSEOP = [];
Object.keys(OP).forEach((key) => {
  REVERSEOP[OP[key]] = key;
});

module.exports = {
  getInstance,
  OP,
};

function getInstance(initObject) {
  return new DMD(initObject);
}

class DMD {

  constructor(initObject) {
    this.interruptCallback = initObject.interruptCallback;
    this.ram = initObject.ram;

    this.videoOutputBuffer = new Uint8Array(DMD_SHADING_FRAMES * DMD_PAGE_SIZE).fill(0);
    this.outputDmdDisplay = outputDmdDisplay.getInstance(DMD_PAGE_SIZE, this.videoOutputBuffer);

    this.videoRam = new Uint8Array(DMD_PAGE_SIZE * DMD_NR_OF_PAGES).fill(0);
  }

  reset() {
    console.log('RESET_DMD_BOARD');
    // DMD has its own 8kb video ram to hold 16 pages of video frames, per byte we store 8 pixels
    this.videoRam.fill(0);
    this.videoOutputBuffer.fill(0);

    // the video pages the CPU has access to, WPC-89 has two mappings while WPC-95 has 6 mappings
    this.dmdPageMapping = [0, 0, 0, 0, 0, 0];

    this.scanline = 0;
    this.activePage = 0;
    // if CPU requested to switch the active page - this holds the new page, will be flipped when scanline is 0
    this.nextActivePage = undefined;

    // we use 3 different frames for the active page - to implement shading
    this.videoOutputPointer = 0;
    this.requestFIRQ = false;
  }

  getState() {
    return {
      scanline: this.scanline,
      lowpage: this.dmdPageMapping[0],
      highpage: this.dmdPageMapping[1],
      activepage: this.activePage,
      // NOTE: this might flicker, as video ram is not double buffered
      videoRam: this.videoRam,
      dmdShadedBuffer: this.outputDmdDisplay.getShadedOutputVideoFrame(),
    };
  }

  setState(dmdState) {
    this.scanline = dmdState.scanline;
    this.dmdPageMapping[0] = dmdState.lowpage;
    this.dmdPageMapping[1] = dmdState.highpage;
    this.activepage = dmdState.activepage;
    this.videoRam = Uint8Array.from(dmdState.videoRam);
  }

  copyScanline() {
    // copy a scanline from the activePage to the output video buffer
    const sourceAddress = this.activePage * DMD_PAGE_SIZE + this.scanline * DMD_SCANLINE_SIZE_IN_BYTES;
    const destinationAddress = this.videoOutputPointer * DMD_PAGE_SIZE + this.scanline * DMD_SCANLINE_SIZE_IN_BYTES;
    for (let i = 0; i < DMD_SCANLINE_SIZE_IN_BYTES; i++) {
      this.videoOutputBuffer[destinationAddress + i] = this.videoRam[sourceAddress + i];
    }

    // select next scanline
    this.scanline = (this.scanline + 1) & 0x1F;

    // framebuffer switch
    if (this.scanline === 0) {
      // flip output buffer, needed to calculate shading
      this.videoOutputPointer = (this.videoOutputPointer + 1) % DMD_SHADING_FRAMES;

      // update output video frame with new and raw input data, shading is made for the last 3 frames
      this.outputDmdDisplay.updateVideoBuffer(this.videoOutputBuffer);

      if (Number.isInteger(this.nextActivePage)) {
        this.activePage = this.nextActivePage;
        this.nextActivePage = undefined;
      }
    }

    // generate FIRQ if requested
    if (this.requestFIRQ === true) {
      if (this.scanline === this.ram[OP.WPC_DMD_SCANLINE] & 0x1F) {
        debug('FIRQ_REQUESTED');
        this.interruptCallback.firqFromDmd();
        this.requestFIRQ = false;
      }
    }
  }

  _getPageOffset(bank, offset) {
    const selectedPage = this.dmdPageMapping[bank];
    return selectedPage * DMD_PAGE_SIZE + offset;
  }

  _selectDmdPage(bank, value) {
    const page = value & 0x0F;
    debug('_selectDmdPage %o', { bank, page });
    this.dmdPageMapping[bank] = page;
  }

  write(offset, value) {
    const address = dmdMapper.getAddress(offset);
    if (address.subsystem === dmdMapper.SUBSYSTEM_DMD_VIDEORAM) {
      const videoRamOffset = this._getPageOffset(address.bank, address.offset);
      this.videoRam[videoRamOffset] = value;
      return;
    }

    this.ram[offset] = value;
    switch (offset) {
      case OP.WPC95_PRINTER_DATA:
      case OP.WPC95_PRINTER_BAUD:
      case OP.WPC95_PRINTER_ADDR:
      case OP.WPC95_PRINTER_STATUS:
      case OP.WPC95_PRINTER_PRESENCE:
        debug('WRITE_IGNORED', REVERSEOP[offset], value);
        break;

      case OP.WPC_DMD_SCANLINE:
        debug('WRITE', REVERSEOP[offset], value);
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
        this.nextActivePage = value & 0xF;
        break;

      //which page is exposed at address 0x3800?
      case OP.WPC_DMD_LOW_PAGE:
        this._selectDmdPage(0, value);
        break;
      case OP.WPC_DMD_HIGH_PAGE:
        this._selectDmdPage(1, value);
        break;
      case OP.WPC95_DMD_PAGE3000:
        this._selectDmdPage(2, value);
        break;
      case OP.WPC95_DMD_PAGE3200:
        this._selectDmdPage(3, value);
        break;
      case OP.WPC95_DMD_PAGE3400:
        this._selectDmdPage(4, value);
        break;
      case OP.WPC95_DMD_PAGE3600:
        this._selectDmdPage(5, value);
        break;

      default:
        debug('W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        console.log('DMD W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  read(offset) {
    const address = dmdMapper.getAddress(offset);
    if (address.subsystem === dmdMapper.SUBSYSTEM_DMD_VIDEORAM) {
      const videoRamOffset = this._getPageOffset(address.bank, address.offset);
      return this.videoRam[videoRamOffset];
    }

    switch (offset) {
      case OP.WPC95_PRINTER_DATA:
      case OP.WPC95_PRINTER_BAUD:
      case OP.WPC95_PRINTER_ADDR:
      case OP.WPC95_PRINTER_STATUS:
      case OP.WPC95_PRINTER_PRESENCE:
      case OP.FREEWPC_DEBUG_CONTROL_PORT:
      case OP.WPC_SERIAL_CONTROL_PORT:
        debug('READ', REVERSEOP[offset]);
        return 0x0;

      case OP.WPC_DMD_SCANLINE:
        debug('READ', REVERSEOP[offset], this.scanline);
        return this.scanline;

      default:
        debug('R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        console.log('DMD R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        return 0x0;
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
