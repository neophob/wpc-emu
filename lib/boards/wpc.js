'use strict';

const debug = require('debug')('wpcemu:boards:wpc');

const WPC_LEDS = 0x3FF2;
const WPC_ROM_BANK = 0x3FFC;
const WPC_ZEROCROSS_IRQ_CLEAR = 0x3FFF;

module.exports = {
  getInstance
};

function getInstance() {
  return new WpcIo();
}

class WpcIo {
  constructor() {
    this.romBank = 0;
    this.diagnosticLeds = 0;
  }

  write(offset, value) {
    switch (offset) {
      case WPC_LEDS:
      debug('WPC_LEDS', value);
      this.diagnosticLeds = value;
      break;

      case WPC_ROM_BANK:
        debug('WPC_ROM_BANK', value);
        this.romBank = value;
        break;

      case WPC_ZEROCROSS_IRQ_CLEAR:
        debug('WRITE WPC_ZEROCROSS_IRQ_CLEAR', value);
        //TODO store Periodic IRQ setting
        break;

      default:
        debug('WPC_W_NOT_IMPLEMENTED', offset);
        break;
    }
  }

  read(offset) {
    switch (offset) {
      case WPC_LEDS:
        return this.diagnosticLeds;

      case WPC_ROM_BANK:
        return this.romBank;

      case WPC_ZEROCROSS_IRQ_CLEAR:
        debug('READ WPC_ZEROCROSS_IRQ_CLEAR');
        return 0;

      default:
        debug('WPC_R_NOT_IMPLEMENTED', offset);
        break;
    }
  }
}

/*
Address	  Format	 Description
$3FE0     Byte     WPC_SOL_GEN_OUTPUT (7-0: W: Enables for solenoids 25-29)
$3FE1     Byte     WPC_SOL_HIGHPOWER_OUTPUT (7-0: W: Enables for solenoids 1-8)
$3FE2     Byte     WPC_SOL_FLASH1_OUTPUT (7-0: W: Enables for solenoids 17-24)
$3FE3     Byte     WPC_SOL_LOWPOWER_OUTPUT (7-0: W: Enables for solenoids 9-16)
$3FE4     Byte     WPC_LAMP_ROW_OUTPUT (7-0: W: Lamp matrix row output)
$3FE5     Byte     WPC_LAMP_COL_STROBE (7-0: W: Enables for solenoids 9-16)
                    7-0: W: Lamp matrix column strobe, At most one bit in this register should be set.
                    If all are clear, then no controlled lamps are enabled.
$3FE6     Byte     WPC_GI_TRIAC
                    7: W: Flipper enable relay
                    5: W: Coin door enable relay
                    4-0: W: General illumination enables
$3FE7     Byte     WPC_SW_JUMPER_INPUT (7-0: R: Jumper/DIP switch inputs)
$3FE8     Byte     WPC_SW_CABINET_INPUT
                    7: R: Fourth coin switch
                    6: R: Right coin switch
                    5: R: Center coin switch
                    4: R: Left coin switch
                    3: R: Enter (Begin Test) button
                    2: R: Up button
                    1: R: Down button
                    0: R: Escape (Service Credit) button
$3FEB     Byte     WPC_EXTBOARD1 (On DMD games, this is a general I/O that is used for machine-specific purposes)
$3FEC     Byte     WPC_EXTBOARD2 (On DMD games, this is a general I/O that is used for machine-specific purposes)
$3FED     Byte     WPC_EXTBOARD3 (On DMD games, this is a general I/O that is used for machine-specific purposes)
$3FF2     Byte     WPC_LEDS (7: R/W: The state of the diagnostic LED. >0=Off >1=On)
$3FF4     Word     WPC_SHIFTADDR
                    15-0: R/W: The base address for the bit shifter.
                    Writing to this address initializes the shifter.
                    Reading from this address after a shift command returns the
                    shifted address.
$3FF6     Byte     WPC_SHIFTBIT
                    7-0: W: Sets the bit position for a shift command.
                    7-0: R: Returns the output of the last shift command as a bitmask.
$3FF7     Byte     WPC_SHIFTBIT2
$3FF8     Byte     WPC_PERIPHERAL_TIMER_FIRQ_CLEAR
$3FF9     Byte     WPC_ROM_LOCK
$3FFA	    Byte	   WPC_CLK_HOURS_DAYS (7-0: R/W: The time-of-day hour counter)
$3FFB	    Byte	   WPC_CLK_MINS (7-0: R/W: The time-of-day minute counter)
$3FFC	    Byte	   WPC_ROM_BANK (5-0: R/W)
                    5-0: R/W: The page of ROM currently mapped into the banked region (0x4000-0x7FFF).
                    Pages 62 and 63 correspond to the uppermost 32KB, and are not normally mapped
                    because those pages are accessible in the fixed region (0x8000-0xFFFF).
                    Page numbers are consecutive.  Page 0 corresponds to the lowest address in a
                    1MB device.  If a smaller ROM is installed, the uppermost bits of this register
                    are effectively ignored.
$3FFD     Byte     WPC_RAM_LOCK
$3FFE     Byte     WPC_RAM_LOCKSIZE
$3FFF     Byte     WPC_ZEROCROSS_IRQ_CLEAR
                    7: R: Set to 1 when AC is currently at a zero crossing, or 0 otherwise.
                    7: W: Writing a 1 here clears the source of the periodic timer interrupt.
                    4: R/W: Periodic timer interrupt enable
                    >0=Periodic IRQ disabled
                    >1=Periodic IRQ enabled
                    2: W: Writing a 1 here resets the watchdog.
*/
