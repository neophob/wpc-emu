'use strict';

/*
$0000-$1FFF (8 KiB)	RAM
$2000-$3FFF (8 KiB)	Hardware
$4000-$7FFF (16 KiB)	Bankswitched ROM (paging area)
$8000-$FFFF (32 KiB)	Non-bankswitched "System ROM"
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
