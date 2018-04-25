'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:wpc');

const OP = {
  WPC_SOL_GEN_OUTPUT: 0x3FE0,
  WPC_SOL_HIGHPOWER_OUTPUT: 0x3FE1,
  WPC_SOL_FLASH1_OUTPUT: 0x3FE2,
  WPC_SOL_LOWPOWER_OUTPUT: 0x3FE3,
  WPC_LAMP_ROW_OUTPUT: 0x3FE4,
  WPC_LAMP_COL_STROBE: 0x3FE5,
  WPC_GI_TRIAC: 0x3FE6,
  WPC_SW_JUMPER_INPUT: 0x3FE7,
  WPC_SW_CABINET_INPUT: 0x3FE8,
  WPC_SW_ROWREAD: 0x3FE9,
  WPC_SW_COLSELECT: 0x3FEA,
  WPC_EXTBOARD1: 0x3FEB,
  WPC_EXTBOARD2: 0x3FEC,
  WPC_EXTBOARD3: 0x3FED,

  WPC_LEDS: 0x3FF2,
  WPC_SHIFTADDRH: 0x3FF4,
  WPC_SHIFTADDRL: 0x3FF5,
  WPC_SHIFTBIT: 0x3FF6,
  WPC_SHIFTBIT2: 0x3FF7,
  WPC_PERIPHERAL_TIMER_FIRQ_CLEAR: 0x3FF8,
  WPC_ROM_LOCK: 0x3FF9,

  WPC_CLK_HOURS_DAYS: 0x3FFA,
  WPC_CLK_MINS: 0x3FFB,
  WPC_ROM_BANK: 0x3FFC,
  WPC_RAM_LOCK: 0x3FFD,
  WPC_RAM_LOCKSIZE: 0x3FFE,
  WPC_ZEROCROSS_IRQ_CLEAR: 0x3FFF,
};

const REVERSEOP = [];
Object.keys(OP).forEach((key) => {
  REVERSEOP[OP[key]] = key;
});

const PAGESIZE_MAP = [0x00, 0x07, 0x0f, 0x00, 0x1f, 0x00, 0x00, 0x00, 0x3f];
const SYSTEM_ROM_BANK_NUMBER1 = 62;
const SYSTEM_ROM_BANK_NUMBER2 = 63;

// country LC_USA_CANADA
const JUMPER_SETTINGS = 0xF0;

module.exports = {
  getInstance,
  SYSTEM_ROM_BANK_NUMBER1,
  SYSTEM_ROM_BANK_NUMBER2,
};

function getInstance(romSizeMBit, interruptCallback) {
  return new WpcIo(romSizeMBit, interruptCallback);
}


class WpcIo {
  constructor(romSizeMBit, interruptCallback) {
    this.interruptCallback = interruptCallback;
    this.pageMask = PAGESIZE_MAP[romSizeMBit];
    debug('pageMask calculated %o', { pageMask: this.pageMask, romSizeMBit });
    this.genericState = new Array(0x4000).fill(0);
    this.periodicIRQTimerEnabled = false;
    this.romBank = 0;
    this.diagnosticLedToggleCount = 0;
    this.oldDiagnostigLedState = 0;
  }

  getUiState() {
    const diagnosticLed = this.genericState[OP.WPC_LEDS];
    return {
      diagnosticLed,
      diagnosticLedToggleCount: this.diagnosticLedToggleCount,
      irqEnabled: this.periodicIRQTimerEnabled,
      activeRomBank: this.romBank,
    };
  }

  write(offset, value) {
    //TODO support ram lock
    this.genericState[offset] = value;

    switch (offset) {

      // save value and bail out
      case OP.WPC_RAM_LOCK:
      case OP.WPC_RAM_LOCKSIZE:
      case OP.WPC_CLK_HOURS_DAYS:
      case OP.WPC_CLK_MINS:
      case OP.WPC_SHIFTADDRH:
      case OP.WPC_SHIFTADDRL:
      case OP.WPC_SHIFTBIT:
      case OP.WPC_SHIFTBIT2:
      case OP.WPC_SOL_GEN_OUTPUT:
      case OP.WPC_SOL_HIGHPOWER_OUTPUT:
      case OP.WPC_SOL_FLASH1_OUTPUT:
      case OP.WPC_SOL_LOWPOWER_OUTPUT:
      case OP.WPC_GI_TRIAC:
      case OP.WPC_PERIPHERAL_TIMER_FIRQ_CLEAR:
      case OP.WPC_LAMP_ROW_OUTPUT:
      case OP.WPC_LAMP_COL_STROBE:
      case OP.WPC_SW_CABINET_INPUT:
      case OP.WPC_SW_COLSELECT:
      case OP.WPC_SW_ROWREAD:
      case OP.WPC_ROM_LOCK:
      case OP.WPC_EXTBOARD1:
      case OP.WPC_EXTBOARD2:
      case OP.WPC_EXTBOARD3:
        debug('WRITE', REVERSEOP[offset], value);
        break;

      case OP.WPC_LEDS:
        if (value !== this.oldDiagnostigLedState) {
          debug('DIAGNOSTIC_LED_TOGGLE', this.oldDiagnostigLedState, value);
          this.diagnosticLedToggleCount++;
          this.oldDiagnostigLedState = value;
        }
        debug('WRITE', REVERSEOP[offset], value);
        break;

      case OP.WPC_ROM_BANK:
        if (value === SYSTEM_ROM_BANK_NUMBER1 || value === SYSTEM_ROM_BANK_NUMBER2) {
          debug('SELECT SYSTEM ROM BANK', value);
          this.romBank = value;
          return;
        }
        debug('WRITE WPC_ROM_BANK', value, value & this.pageMask);
        // only 6 bits
        this.romBank = value & this.pageMask;
        break;

      case OP.WPC_ZEROCROSS_IRQ_CLEAR:
        if (value & 0x80) {
          debug('WRITE WPC_ZEROCROSS_IRQ_CLEAR: WPC_ZEROCROSS_IRQ_CLEAR', value);
          //TODO? this.interruptCallback.firq();
          //TODO clears the source of the periodic timer interrupt.
        }
        if (value & 0x04) {
          //debug('WRITE WPC_ZEROCROSS_IRQ_CLEAR: RESET WATCHDOG');
        }

        const timerEnabled = (value & 0x10) > 0;
        if (timerEnabled !== this.periodicIRQTimerEnabled) {
          debug('WRITE WPC_ZEROCROSS_IRQ_CLEAR periodic timer changed', timerEnabled);
        }
        this.periodicIRQTimerEnabled = timerEnabled;
        break;

      default:
        debug('W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  read(offset) {
    let temp;
    switch (offset) {
      //ignored
      case OP.WPC_RAM_LOCK:
      case OP.WPC_RAM_LOCKSIZE:
      case OP.WPC_LEDS:
      case OP.WPC_LAMP_ROW_OUTPUT:
      case OP.WPC_LAMP_COL_STROBE:
      case OP.WPC_SW_CABINET_INPUT:
      case OP.WPC_SW_COLSELECT:
      case OP.WPC_SW_ROWREAD:
      case OP.WPC_ROM_BANK:
      case OP.WPC_ROM_LOCK:
      case OP.WPC_EXTBOARD1:
      case OP.WPC_EXTBOARD2:
      case OP.WPC_EXTBOARD3:
        debug('READ', REVERSEOP[offset], this.genericState[offset]);
        return this.genericState[offset];

      case OP.WPC_SHIFTADDRH:
        temp = this.genericState[OP.WPC_SHIFTADDRH] + ((this.genericState[OP.WPC_SHIFTADDRL] + (this.genericState[OP.WPC_SHIFTBIT] >>> 3)) >>> 8);
        debug('READ WPC_SHIFTADDRH', temp);
        return temp;
      case OP.WPC_SHIFTADDRL:
        temp = (this.genericState[OP.WPC_SHIFTADDRL] + (this.genericState[OP.WPC_SHIFTBIT] >>> 3)) & 0xff;
        debug('READ WPC_SHIFTADDRL', temp);
        return temp;
      case OP.WPC_SHIFTBIT:
        debug('READ WPC_SHIFTBIT');
        return 1 << (this.genericState[OP.WPC_SHIFTBIT] & 0x07);
      case OP.WPC_SHIFTBIT2:
        debug('READ WPC_SHIFTBIT2');
        return 1 << (this.genericState[OP.WPC_SHIFTBIT] & 0x07);

      case OP.WPC_CLK_HOURS_DAYS:
        //TODO pinmame adds date infos and checksum to the ram?
        const dateHour = new Date();
        debug('READ WPC_CLK_HOURS_DAYS', dateHour.getHours());
        return dateHour.getHours();

      case OP.WPC_CLK_MINS:
        const dateMinute = new Date();
        debug('READ WPC_CLK_MINS', dateMinute.getMinutes());
        return dateMinute.getMinutes();

      case OP.WPC_SW_JUMPER_INPUT:
        //SW1 SW2 W20 W19 Country(SW4-SW8)
        debug('READ WPC_SW_JUMPER_INPUT');
        //TODO unsure here
        return JUMPER_SETTINGS;

      case OP.WPC_ZEROCROSS_IRQ_CLEAR:
        //TODO fixme
        debug('READ WPC_ZEROCROSS_IRQ_CLEAR');
        return 0x0;

      case OP.WPC_PERIPHERAL_TIMER_FIRQ_CLEAR:
        debug('READ WPC_PERIPHERAL_TIMER_FIRQ_CLEAR');
        //TODO support FIRQ source from DMD - the return appropriate value
        //return (wpclocals.firqSrc & WPC_FIRQ_DMD) ? 0x00 : 0x80;
//        return 0x0;
        return 0xff;

      default:
        debug('R_NOT_IMPLEMENTED', '0x' + offset.toString(16), this.genericState[offset]);
        return this.genericState[offset];
    }
  }
}

/*

18:28:10.416 browser.js:133 wpcemu:boards:wpc W_NOT_IMPLEMENTED +0ms 0x3ff1 191
18:28:10.417 browser.js:133 wpcemu:boards:wpc W_NOT_IMPLEMENTED +2ms 0x3ff0 1
18:28:10.417 browser.js:133 wpcemu:boards:wpc W_NOT_IMPLEMENTED +0ms 0x3fef 20
18:28:10.418 browser.js:133 wpcemu:boards:wpc W_NOT_IMPLEMENTED +1ms 0x3fee 1
                            wpcemu:boards:wpc W_NOT_IMPLEMENTED +0ms 0x3fe7 249   ???

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
$3fe9     Byte     WPC_SWROWREAD, R: Switch row read
$3fea     Byte     WPC_SWCOLSELECT, W: Switch column enable
$3FEB     Byte     WPC_EXTBOARD1 (On DMD games, this is a general I/O that is used for machine-specific purposes)
$3FEC     Byte     WPC_EXTBOARD2 (On DMD games, this is a general I/O that is used for machine-specific purposes)
$3FED     Byte     WPC_EXTBOARD3 (On DMD games, this is a general I/O that is used for machine-specific purposes)
$3FF2     Byte     WPC_LEDS (7: R/W: The state of the diagnostic LED. >0=Off >1=On)
                    - blink once, it indicates a problem with the CPU ROM
                    - blink twice, the game RAM is faulty, or, again, traces, etc
                    - blink thrice, there's a problem with the ASIC, or again, traces, etc.
$3FF4     Byte     WPC_SHIFTADDRH
$3FF5     Byte     WPC_SHIFTADDRL
                    15-0: R/W: The base address for the bit shifter.
                    Writing to this address initializes the shifter.
                    Reading from this address after a shift command returns the
                    shifted address.
$3FF6     Byte     WPC_SHIFTBIT
                    7-0: W: Sets the bit position for a shift command.
                    7-0: R: Returns the output of the last shift command as a bitmask.
$3FF7     Byte     WPC_SHIFTBIT2
$3FF8     Byte     WPC_PERIPHERAL_TIMER_FIRQ_CLEAR R: bit 7 0=DMD, 1=SOUND? W: Clear FIRQ line
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
