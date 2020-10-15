'use strict';

const MEMORY_ADDR_EXPANSION_START = 0x3000;
const MEMORY_ADDR_DMD = 0x3FC0;
const MEMORY_ADDR_EXTERNAL_IO = 0x3FDC;
const MEMORY_ADDR_SOUND = 0x3FE0;

const MEMORY_ADDR_FLIPTRONICS_FLIPPER_PORT_A = 0x3FD4;
const MEMORY_ADDR_FLIPTRONICS_FLIPPER_PORT_WPC95 = 0x3FEF;

const MEMORY_ADDR_WPC_IO = 0x4000;

const MEMORY_ALPHANUMERIC_DISPLAY = [ 0x3FEB, 0x3FEC, 0x3FED, 0x3FEE, 0x3FEF ];

const SUBSYSTEM_WPCIO = 'wpcio';
const SUBSYSTEM_SOUND = 'sound';
const SUBSYSTEM_EXTERNAL_IO = 'externalIo';
const SUBSYSTEM_DISPLAY = 'display';

module.exports = {
  getAddress,
  SUBSYSTEM_WPCIO,
  SUBSYSTEM_SOUND,
  SUBSYSTEM_EXTERNAL_IO,
  SUBSYSTEM_DISPLAY,
};

function buildReturnModel(offset, subsystem) {
  return { offset, subsystem };
}

function getAddress(offset, hasAlphaNumbericDisplay) {
  if (typeof offset === 'undefined') {
    throw new Error('HW_GET_ADDRESS_UNDEFINED');
  }
  offset &= 0xFFFF;

  if (offset < MEMORY_ADDR_EXPANSION_START) {
    throw new Error('HW_GET_ADDRESS_INVALID_MEMORY_REGION_0x' + offset.toString(16));
  }
  if (offset < MEMORY_ADDR_DMD || hasAlphaNumbericDisplay && MEMORY_ALPHANUMERIC_DISPLAY.includes(offset)) {
    return buildReturnModel(offset, SUBSYSTEM_DISPLAY);
  }
  if (offset === MEMORY_ADDR_FLIPTRONICS_FLIPPER_PORT_A || offset === MEMORY_ADDR_FLIPTRONICS_FLIPPER_PORT_WPC95) {
    return buildReturnModel(offset, SUBSYSTEM_WPCIO);
  }
  if (offset < MEMORY_ADDR_EXTERNAL_IO) {
    return buildReturnModel(offset, SUBSYSTEM_EXTERNAL_IO);
  }
  if (offset < MEMORY_ADDR_SOUND) {
    return buildReturnModel(offset, SUBSYSTEM_SOUND);
  }
  if (offset < MEMORY_ADDR_WPC_IO) {
    return buildReturnModel(offset, SUBSYSTEM_WPCIO);
  }
  throw new Error('HW_GET_ADDRESS_INVALID_MEMORY_REGION_0x' + offset.toString(16));
}

/*
$2000-$3FFF (8 KiB)	Hardware
            Address range	  Description
            $2000-$37FF	    Expansion (maybe security chip of WPC-S and WPC-95)
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
            $3FC0-$3FDF	    External I/O control
                            Address	  Format	 Description
                            $3FC0     Byte     WPC_PARALLEL_STATUS_PORT
                            $3FC1     Byte     WPC_PARALLEL_DATA_PORT
                            $3FC2     Byte     WPC_PARALLEL_STROBE_PORT
                            $3FC3     Byte     WPC_SERIAL_DATA_OUTPUT
                            $3FC4     Byte     WPC_SERIAL_CONTROL_OUTPUT
                            $3FC5     Byte     WPC_SERIAL_BAUD_SELECT
                            $3FC6     Byte     WPC_TICKET_DISPENSE
                            $3FD4     Byte     WPC_FLIPTRONIC_PORT_A
                            $3FD6     Byte     WPC_FLIPTRONIC_PORT_B (Ununsed)
                            $3FDC     Byte     WPCS_DATA (7-0: R/W: Send/receive a byte of data to/from the sound board)
                            $3FDD     Byte     WPCS_CONTROL_STATUS
                                                7: R: WPC sound board read ready
                                                0: R: DCS sound board read ready

            $3FE0-$3FFF	    WPC I/O control
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
                                               WPC_ALPHA_POS
                            $3FEC     Byte     WPC_EXTBOARD2 (On DMD games, this is a general I/O that is used for machine-specific purposes)
                                               WPC_ALPHA_ROW1
                            $3FED     Byte     WPC_EXTBOARD3 (On DMD games, this is a general I/O that is used for machine-specific purposes)
                            $3FEE     Byte     WPC_ALPHA_ROW2

                            #define WPC_FLIPPERCOIL95 (0x3fee - WPC_BASE) /*      x W: Flipper Solenoids
                            #define WPC_FLIPPERSW95   (0x3fef - WPC_BASE) /*      x R: Flipper switches

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
