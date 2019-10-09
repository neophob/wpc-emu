'use strict';

const debug = require('debug')('wpcemu:boards:dmd');
const dmdMapper = require('./mapper/dmd.js');
const outputDmdDisplay = require('./elements/output-dmd-display');
const outputAlphaDisplay = require('./elements/output-alpha-display');

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

  WPC_ALPHA_POS: 0x3FEB, 
  WPC_ALPHA_ROW1_A: 0x3FEC, 
  WPC_ALPHA_ROW1_B: 0x3FED, 
  WPC_ALPHA_ROW2_A: 0x3FEE, 
  WPC_ALPHA_ROW2_B: 0x3FEF
};

// 128 * 32
const DMD_PAGE_SIZE = 0x200;

const REVERSEOP = [];
Object.keys(OP).forEach((key) => {
  REVERSEOP[OP[key]] = key;
});

module.exports = {
  getInstance,
  OP,
};

function getInstance(initObject) {
  return new DisplayBoard(initObject);
}

class DisplayBoard {

  constructor(initObject) {
    this.interruptCallback = initObject.interruptCallback;
    this.ram = initObject.ram;
    this.hasAlphanumericDisplay = initObject.hasAlphanumericDisplay;

    this.outputDmdDisplay = outputDmdDisplay.getInstance(DMD_PAGE_SIZE);
    this.outputAlphaDisplay = outputAlphaDisplay.getInstance(DMD_PAGE_SIZE);
  }

  reset() {
    console.log('RESET_DISPLAY_BOARD');
  }

  getState() {
    if (this.hasAlphanumericDisplay) {
      return this.outputAlphaDisplay.getState();
    }
    return this.outputDmdDisplay.getState();
  }

  setState(displayState) {
    if (this.hasAlphanumericDisplay) {
      return this.outputAlphaDisplay.setState(displayState);
    }
    return this.outputDmdDisplay.setState(displayState);
  }

  executeCycle(singleTicks) {
    if (this.hasAlphanumericDisplay) {
      this.outputAlphaDisplay.executeCycle(singleTicks);
      return;
    } 
    
    const dmdState = this.outputDmdDisplay.executeCycle(singleTicks);
    // NOTE: if this.ram[OP.WPC_DMD_SCANLINE] > 0x1F then NO FIRQ call is made. scanline is never bigger than 0x1F.
    if (dmdState && dmdState.requestFIRQ && dmdState.scanline === this.ram[OP.WPC_DMD_SCANLINE]) {
      this.interruptCallback.firqFromDmd();
      this.outputDmdDisplay.requestFIRQ = false;
    }
  }

  write(offset, value) {
    const address = dmdMapper.getAddress(offset);
    if (address.subsystem === dmdMapper.SUBSYSTEM_DMD_VIDEORAM) {
      this.outputDmdDisplay.writeVideoRam(address.bank, address.offset, value);
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
        this.outputDmdDisplay.requestFIRQ = true;
        break;

      case OP.WPC_DMD_ACTIVE_PAGE:
        debug('WRITE', REVERSEOP[offset], value);
        // The visible page register, WPC_DMD_ACTIVE_PAGE, holds the page number of the frame that should
        // be clocked to the display. Writing to this register does not take effect immediately but instead
        // at the beginning of the next vertical retrace.
        this.outputDmdDisplay.setNextActivePage(value);
        break;

      //which page is exposed at address 0x3800?
      case OP.WPC_DMD_LOW_PAGE:
        // AKA PAGE3800
        this.outputDmdDisplay.selectDmdPage(0, value);
        break;
      case OP.WPC_DMD_HIGH_PAGE:
        // AKA PAGE3A00
        this.outputDmdDisplay.selectDmdPage(1, value);
        break;
      case OP.WPC95_DMD_PAGE3000:
        this.outputDmdDisplay.selectDmdPage(2, value);
        break;
      case OP.WPC95_DMD_PAGE3200:
        this.outputDmdDisplay.selectDmdPage(3, value);
        break;
      case OP.WPC95_DMD_PAGE3400:
        this.outputDmdDisplay.selectDmdPage(4, value);
        break;
      case OP.WPC95_DMD_PAGE3600:
        this.outputDmdDisplay.selectDmdPage(5, value);
        break;

      case OP.WPC_ALPHA_POS:
        this.outputAlphaDisplay.setSegmentColumn(value);
        break;
      case OP.WPC_ALPHA_ROW1_A:
        this.outputAlphaDisplay.setRow1(true, value);
        break;
      case OP.WPC_ALPHA_ROW1_B:
        this.outputAlphaDisplay.setRow1(false, value);
        break;
      case OP.WPC_ALPHA_ROW2_A:
        this.outputAlphaDisplay.setRow2(true, value);
        break;
      case OP.WPC_ALPHA_ROW2_B:
        this.outputAlphaDisplay.setRow2(false, value);
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
      return this.outputDmdDisplay.readVideoRam(address.bank, address.offset);
    }

    switch (offset) {
      case OP.WPC95_PRINTER_DATA:
      case OP.WPC95_PRINTER_BAUD:
      case OP.WPC95_PRINTER_ADDR:
      case OP.WPC95_PRINTER_STATUS:
      case OP.WPC95_PRINTER_PRESENCE:
      case OP.FREEWPC_DEBUG_CONTROL_PORT:
      case OP.WPC_SERIAL_CONTROL_PORT:
        debug('READ', REVERSEOP[offset], 0);
        return 0x0;

      case OP.WPC_ALPHA_POS:
      case OP.WPC_ALPHA_ROW1_A:
      case OP.WPC_ALPHA_ROW1_B:
      case OP.WPC_ALPHA_ROW2_A:
      case OP.WPC_ALPHA_ROW2_B:
        debug('READ', REVERSEOP[offset]);
        return this.ram[offset];
    
      case OP.WPC_DMD_SCANLINE:
        debug('READ', REVERSEOP[offset], this.scanline);
        return this.ram[offset];

      default:
        debug('R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        console.log('DMD R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        return 0x0;
    }
  }
}
