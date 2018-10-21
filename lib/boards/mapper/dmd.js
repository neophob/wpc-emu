'use strict';

// this is the mapping for the dmd board

const MEMORY_ADDR_DMD_PAGE3000 = 0x3000;
const MEMORY_ADDR_DMD_PAGE3200 = 0x3200;
const MEMORY_ADDR_DMD_PAGE3400 = 0x3400;
const MEMORY_ADDR_DMD_PAGE3600 = 0x3600;
const MEMORY_ADDR_DMD_PAGE_LOW = 0x3800;
const MEMORY_ADDR_DMD_PAGE_HIGH = 0x3A00;

const SUBSYSTEM_DMD_VIDEORAM = 'videoram';
const SUBSYSTEM_CMD = 'command';

module.exports = {
  getAddress,
  SUBSYSTEM_DMD_VIDEORAM,
  SUBSYSTEM_CMD,
  MEMORY_ADDR_DMD_PAGE3000,
  MEMORY_ADDR_DMD_PAGE3200,
  MEMORY_ADDR_DMD_PAGE3400,
  MEMORY_ADDR_DMD_PAGE3600,
  MEMORY_ADDR_DMD_PAGE_LOW,
  MEMORY_ADDR_DMD_PAGE_HIGH,
};

function buildReturnModel(offset, subsystem, bank) {
  return { offset, subsystem, bank };
}

function getAddress(offset) {
  if (typeof offset === 'undefined') {
    throw new Error('DMD_GET_ADDRESS_UNDEFINED');
  }
  if (offset < MEMORY_ADDR_DMD_PAGE3000) {
    throw new Error('INVALID_DMD_ADRESSRANGE_' + offset);
  }

  offset &= 0xFFFF;
  if (offset < MEMORY_ADDR_DMD_PAGE3200) {
    return buildReturnModel(offset - MEMORY_ADDR_DMD_PAGE3000, SUBSYSTEM_DMD_VIDEORAM, 2);
  }
  if (offset < MEMORY_ADDR_DMD_PAGE3400) {
    return buildReturnModel(offset - MEMORY_ADDR_DMD_PAGE3200, SUBSYSTEM_DMD_VIDEORAM, 3);
  }
  if (offset < MEMORY_ADDR_DMD_PAGE3600) {
    return buildReturnModel(offset - MEMORY_ADDR_DMD_PAGE3400, SUBSYSTEM_DMD_VIDEORAM, 4);
  }
  if (offset < MEMORY_ADDR_DMD_PAGE_LOW) {
    return buildReturnModel(offset - MEMORY_ADDR_DMD_PAGE3600, SUBSYSTEM_DMD_VIDEORAM, 5);
  }
  if (offset < MEMORY_ADDR_DMD_PAGE_HIGH) {
    return buildReturnModel(offset - MEMORY_ADDR_DMD_PAGE_LOW, SUBSYSTEM_DMD_VIDEORAM, 0);
  }
  if (offset < MEMORY_ADDR_DMD_PAGE_HIGH + 0x200) {
    return buildReturnModel(offset - MEMORY_ADDR_DMD_PAGE_HIGH, SUBSYSTEM_DMD_VIDEORAM, 1);
  }
  return buildReturnModel(offset, SUBSYSTEM_CMD);
}
