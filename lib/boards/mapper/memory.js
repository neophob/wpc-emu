'use strict';

const MEMORY_ADDR_RAM = 0x3000;
const MEMORY_ADDR_RAM2_START = 0x3C00;
const MEMORY_ADDR_RAM2_END = 0x3FAF;
const MEMORY_ADDR_HARDWARE = 0x4000;
const MEMORY_ADDR_BANKSWITCHED_ROM = 0x8000;
const MEMORY_ADDR_SYSTEMROM = 0x10000;

const SUBSYSTEM_RAM = 'ram';
const SUBSYSTEM_HARDWARE = 'hardware';
const SUBSYSTEM_BANKSWITCHED = 'bank';
const SUBSYSTEM_SYSTEMROM = 'system';

module.exports = {
  getAddress,
  MEMORY_ADDR_RAM,
  MEMORY_ADDR_HARDWARE,
  SUBSYSTEM_RAM,
  SUBSYSTEM_HARDWARE,
  SUBSYSTEM_BANKSWITCHED,
  SUBSYSTEM_SYSTEMROM,
};

function getAddress(offset) {
  if (typeof offset === 'undefined') {
    throw new Error('MEMORY_GET_ADDRESS_UNDEFINED');
  }
  offset &= 0xFFFF;

  const isRam2Region = offset >= MEMORY_ADDR_RAM2_START && offset <= MEMORY_ADDR_RAM2_END;
  if (offset < MEMORY_ADDR_RAM || isRam2Region) {
    return { offset, subsystem: SUBSYSTEM_RAM };
  }
  if (offset < MEMORY_ADDR_HARDWARE) {
    return { offset, subsystem: SUBSYSTEM_HARDWARE };
  }
  if (offset < MEMORY_ADDR_BANKSWITCHED_ROM) {
    return { offset: offset - 0x4000, subsystem: SUBSYSTEM_BANKSWITCHED };
  }
  if (offset < MEMORY_ADDR_SYSTEMROM) {
    return { offset: offset - 0x8000, subsystem: SUBSYSTEM_SYSTEMROM };
  }
  throw new Error('MEMORY_GET_ADDRESS_INVALID_MEMORY_REGION_0x' + offset.toString(16));
}

/*
6809 memory map for WPC machines, source: http://www.maddes.net/pinball/wpc_debugging.htm and https://github.com/bcd/freewpc/blob/master/doc/hardware.texi

//MAME definition for WPC DMD - https://github.com/mamedev/mame/blob/115bb9936c5cd3faf955d7eb1e251a94e4744b7b/src/mame/drivers/wpc_dot.cpp

map(0x0000, 0x2fff).rw(this, FUNC(wpc_dot_state::ram_r), FUNC(wpc_dot_state::ram_w));
map(0x3000, 0x31ff).bankrw("dmdbank1");
map(0x3200, 0x33ff).bankrw("dmdbank2");
map(0x3400, 0x35ff).bankrw("dmdbank3");
map(0x3600, 0x37ff).bankrw("dmdbank4");
map(0x3800, 0x39ff).bankrw("dmdbank5");
map(0x3a00, 0x3bff).bankrw("dmdbank6");
map(0x3c00, 0x3faf).ram();
map(0x3fb0, 0x3fff).rw(m_wpc, FUNC(wpc_device::read), FUNC(wpc_device::write)); // WPC device
map(0x4000, 0x7fff).bankr("cpubank");
map(0x8000, 0xffff).bankr("fixedbank");

{ 0x0000, 0x2fff, MRA_RAM },
{ 0x3000, 0x31ff, MRA_BANK4 },   DMD
{ 0x3200, 0x33ff, MRA_BANK5 },   DMD
{ 0x3400, 0x35ff, MRA_BANK6 },   DMD
{ 0x3600, 0x37ff, MRA_BANK7 },   DMD
{ 0x3800, 0x39ff, MRA_BANK2 },   DMD
{ 0x3A00, 0x3bff, MRA_BANK3 },   DMD
{ 0x3c00, 0x3faf, MRA_RAM },
{ 0x3fb0, 0x3fff, wpc_r },
{ 0x4000, 0x7fff, MRA_BANK1 },
{ 0x8000, 0xffff, MRA_ROM },

$0000-$1FFF (8 KiB)	RAM

$2000-$3FFF (8 KiB)	Hardware
            Address range	  Description

            // mame definition
            map(0x3000, 0x31ff).bankrw("dmdbank1");
          	map(0x3200, 0x33ff).bankrw("dmdbank2");
          	map(0x3400, 0x35ff).bankrw("dmdbank3");
          	map(0x3600, 0x37ff).bankrw("dmdbank4");
          	map(0x3800, 0x39ff).bankrw("dmdbank5");
          	map(0x3a00, 0x3bff).bankrw("dmdbank6");

            $3c00-$3faf     RAM

            $3800-$39FF	    DMD Page 1
                            Address	  Format	 Description
                            $3800     ??       WPC_DMD_RAM_BASE
                                                Display RAM (1K).  Which 1K portion of the 16K SRAM
                                                appears here is controlled by writing to two display
                                                paging registers, WPC_DMD_HIGH_PAGE and WPC_DMD_LOW_PAGE.
            $3A00-$3BFF	    DMD Page 2
            $3C00-$3FAF	    ??? Expansion -> RAM?
                            Address	  Format	 Description
                            $3D60     Byte     WPC_DEBUG_DATA_PORT
                            $3D61     Byte     WPC_DEBUG_CONTROL_PORT
                            $3D66     Byte     WPC_SERIAL_CONTROL_PORT
                            $3D67     Byte     WPC_SERIAL_DATA_PORT
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
                            $3FEC     Byte     WPC_EXTBOARD2 (On DMD games, this is a general I/O that is used for machine-specific purposes)
                            $3FED     Byte     WPC_EXTBOARD3 (On DMD games, this is a general I/O that is used for machine-specific purposes)

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

$4000-$7FFF (16 KiB)	Bankswitched ROM (paging area) - READ ONLY

$8000-$FFFF (32 KiB)	Non-bankswitched "System ROM"
Contains the last 32 KiB of Game ROM
            Address	  Format	 Description
            $FFEC	    Word	   Checksum "correction"
            $FFEE	    Word	   Checksum
            $FFEF	    Byte	   ROM Version, low byte of the checksum
            $FFF0	    Word	   Reserved by Motorola
            $FFF2	    Word	   Software Interrupt 3 (SW3) vector
            $FFF4	    Word	   Software Interrupt 2 (SW2) vector
            $FFF6	    Word	   Fast Interrupt Request (FIRQ), DISABLED on WPC
            $FFF8	    Word	   Interrupt Request (IRQ) vector, DISABLED on WPC
            $FFFA	    Word	   Software Interrupt [1] (SWI) vector
            $FFFC	    Word	   Non-maskable Interrupt (NMI) vector
            $FFFE	    Word	   Reset vector (address of the first instruction)

*/
