const test = require('ava');
const HardwareMapper = require('../../../../lib/boards/mapper/hardware');

test('HardwareMapper, should get address, 0x3FC2', (t) => {
  const expectedResult = {
    offset: 0x3FC2,
    subsystem: 'externalIo',
  };
  const result = HardwareMapper.getAddress(0x3FC2);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0', (t) => {
  t.throws(() => HardwareMapper.getAddress(0), { message: 'HW_GET_ADDRESS_INVALID_MEMORY_REGION_0x0' });
});

test('HardwareMapper, should get address, -1', (t) => {
  t.throws(() => HardwareMapper.getAddress(-1), { message: 'HW_GET_ADDRESS_INVALID_MEMORY_REGION_0xffff' });
});

test('HardwareMapper, should get address, 0x3200 (DMD PAGE)', (t) => {
  const expectedResult = {
    offset: 0x3200,
    subsystem: 'display',
  };
  const result = HardwareMapper.getAddress(0x3200);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3BFF (DMD PAGE)', (t) => {
  const expectedResult = {
    offset: 0x3BFF,
    subsystem: 'display',
  };
  const result = HardwareMapper.getAddress(0x3BFF);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3800 (DMD PAGE 1)', (t) => {
  const expectedResult = {
    offset: 0x3800,
    subsystem: 'display',
  };
  const result = HardwareMapper.getAddress(0x3800);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3A00 (DMD PAGE 2)', (t) => {
  const expectedResult = {
    offset: 0x3A00,
    subsystem: 'display',
  };
  const result = HardwareMapper.getAddress(0x3A00);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should fail to get address, 0x4000', (t) => {
  t.throws(() => HardwareMapper.getAddress(0x4000), { message: 'HW_GET_ADDRESS_INVALID_MEMORY_REGION_0x4000' });
});

test('HardwareMapper, should fail to get invalid offset', (t) => {
  t.throws(HardwareMapper.getAddress, { message: 'HW_GET_ADDRESS_UNDEFINED' });
});

test('HardwareMapper, should fail to get address, 0x2000', (t) => {
  t.throws(() => HardwareMapper.getAddress(0x2000), { message: 'HW_GET_ADDRESS_INVALID_MEMORY_REGION_0x2000' });
});

test('HardwareMapper, should get address, 0x3800', (t) => {
  const expectedResult = {
    offset: 0x3800,
    subsystem: 'display',
  };
  const result = HardwareMapper.getAddress(0x3800);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3c00', (t) => {
  const expectedResult = {
    offset: 0x3C00,
    subsystem: 'display',
  };
  const result = HardwareMapper.getAddress(0x3C00);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3E66 - WPC_SERIAL_CONTROL_PORT **FIXME**', (t) => {
  const expectedResult = {
    offset: 0x3E66,
    subsystem: 'display',
  };
  const result = HardwareMapper.getAddress(0x3E66);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3FC0', (t) => {
  const expectedResult = {
    offset: 0x3FC0,
    subsystem: 'externalIo',
  };
  const result = HardwareMapper.getAddress(0x3FC0);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3FD6', (t) => {
  const expectedResult = {
    offset: 0x3FD6,
    subsystem: 'externalIo',
  };
  const result = HardwareMapper.getAddress(0x3FD6);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3FDC - WPCS_DATA', (t) => {
  const expectedResult = {
    offset: 0x3FDC,
    subsystem: 'sound',
  };
  const result = HardwareMapper.getAddress(0x3FDC);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3FDD - WPCS_CONTROL_STATUS', (t) => {
  const expectedResult = {
    offset: 0x3FDD,
    subsystem: 'sound',
  };
  const result = HardwareMapper.getAddress(0x3FDD);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3FDE', (t) => {
  const expectedResult = {
    offset: 0x3FDE,
    subsystem: 'sound',
  };
  const result = HardwareMapper.getAddress(0x3FDE);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3FE0', (t) => {
  const expectedResult = {
    offset: 0x3FE0,
    subsystem: 'wpcio',
  };
  const result = HardwareMapper.getAddress(0x3FE0);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get exception for fliptronics address', (t) => {
  const MEMORY_ADDR_FLIPTRONICS_FLIPPER_PORT_A = 0x3FD4;
  const expectedResult = {
    offset: MEMORY_ADDR_FLIPTRONICS_FLIPPER_PORT_A,
    subsystem: 'wpcio',
  };
  const result = HardwareMapper.getAddress(MEMORY_ADDR_FLIPTRONICS_FLIPPER_PORT_A);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get display address, 0x3FEB', (t) => {
  const expectedResult = {
    offset: 0x3FEB,
    subsystem: 'wpcio',
  };
  const result = HardwareMapper.getAddress(0x3FEB);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get display address for alpha numeric displays, 0x3FEB', (t) => {
  const expectedResult = {
    offset: 0x3FEB,
    subsystem: 'display',
  };
  const result = HardwareMapper.getAddress(0x3FEB, true);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get display address, 0x3FEF', (t) => {
  const expectedResult = {
    offset: 0x3FEF,
    subsystem: 'wpcio',
  };
  const result = HardwareMapper.getAddress(0x3FEF);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get display address for alpha numeric displays, 0x3FEF', (t) => {
  const expectedResult = {
    offset: 0x3FEF,
    subsystem: 'display',
  };
  const result = HardwareMapper.getAddress(0x3FEF, true);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get DCS data, 0x3FDC', (t) => {
  const expectedResult = {
    offset: 0x3FDC,
    subsystem: 'sound',
  };
  const result = HardwareMapper.getAddress(0x3FDC);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get DCS data, 0x3FDD', (t) => {
  const expectedResult = {
    offset: 0x3FDD,
    subsystem: 'sound',
  };
  const result = HardwareMapper.getAddress(0x3FDD);
  t.deepEqual(result, expectedResult);
});
