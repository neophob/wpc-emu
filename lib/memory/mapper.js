'use strict';

/*
6809 memory map for WPC machines, source: http://www.maddes.net/pinball/wpc_debugging.htm

$0000-$1FFF (8 KiB)	RAM
            Address	  Format	 Description
            $0011	    Byte	   Current Bank Marker
            $0012	    Word	   Bank Jump Address

$2000-$3FFF (8 KiB)	Hardware
            Address range	  Description
            $2000-$37FF	    Expansion (maybe security chip of WPC-S and WPC-95)
            $3800-$39FF	    DMD Page
            $3A00-$3BFF	    DMD Page
            $3C00-$3FAF	    ??? Expansion
            $3FBC-$3FBF	    DMD display control
            $3FC0-$3FDF	    External I/O control
            $3FE0-$3FFF	    WPC I/O control
                            Address	  Format	 Description
                            $3FFC	    Byte	   Bank selector

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
            $FFFE	    Word	   Reset vector
*/

const MEMORY_ADDR_RAM = 0x2000;
const MEMORY_ADDR_HARDWARE = 0x4000;
const MEMORY_ADDR_BANKSWITCHED_ROM = 0x8000;
const MEMORY_ADDR_SYSTEM = 0x10000;

const SUBSYSTEM_RAM = 'ram';
const SUBSYSTEM_HARDWARE = 'hardware';
const SUBSYSTEM_BANKSWITCHED = 'bank';
const SUBSYSTEM_SYSTEM = 'system';

module.exports = {
  getAddress,
  MEMORY_ADDR_RAM,
  SUBSYSTEM_RAM,
  SUBSYSTEM_HARDWARE,
  SUBSYSTEM_BANKSWITCHED,
  SUBSYSTEM_SYSTEM,
};

function buildReturnModel(offset, subsystem) {
  return { offset, subsystem };
}

function getAddress(offset) {
  if (offset < 0) {
    throw new Error('INVALID_MEMORY_REGION_' + offset);
  }
  if (offset < MEMORY_ADDR_RAM) {
    return buildReturnModel(offset, SUBSYSTEM_RAM);
  }
  if (offset < MEMORY_ADDR_HARDWARE) {
    return buildReturnModel(offset, SUBSYSTEM_HARDWARE);
  }
  if (offset < MEMORY_ADDR_BANKSWITCHED_ROM) {
    return buildReturnModel(offset, SUBSYSTEM_BANKSWITCHED);
  }
  if (offset < MEMORY_ADDR_SYSTEM) {
    return buildReturnModel(offset - 0x8000, SUBSYSTEM_SYSTEM);
  }
  throw new Error('INVALID_MEMORY_REGION_' + offset);
}
