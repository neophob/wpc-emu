'use strict';

import test from 'ava';
import HardwareMapper from '../../../../lib/boards/mapper/hardware';

test('HardwareMapper, should get address, 0x3FC2', (t) => {
  const expectedResult = {
    offset: 0x3FC2,
    subsystem: 'externalIo',
  };
  const result = HardwareMapper.getAddress(0x3FC2);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0', (t) => {
  t.throws(() => HardwareMapper.getAddress(0), 'HW_GET_ADDRESS_INVALID_MEMORY_REGION_0x0');
});

test('HardwareMapper, should get address, -1', (t) => {
  t.throws(() => HardwareMapper.getAddress(-1), 'HW_GET_ADDRESS_INVALID_MEMORY_REGION_0xffff');
});

test('HardwareMapper, should get address, 0x4000', (t) => {
  t.throws(() => HardwareMapper.getAddress(0x4000), 'HW_GET_ADDRESS_INVALID_MEMORY_REGION_0x4000');
});

test('HardwareMapper, should fail when using invalid offset', (t) => {
  t.throws(HardwareMapper.getAddress, 'HW_GET_ADDRESS_UNDEFINED');
});

test('HardwareMapper, should get address, 0x2000', (t) => {
  const expectedResult = {
    offset: 0x2000,
    subsystem: 'expansion',
  };
  const result = HardwareMapper.getAddress(0x2000);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3800', (t) => {
  const expectedResult = {
    offset: 0x3800,
    subsystem: 'dmd',
  };
  const result = HardwareMapper.getAddress(0x3800);
  t.deepEqual(result, expectedResult);
});

test('HardwareMapper, should get address, 0x3c00', (t) => {
  const expectedResult = {
    offset: 0x3C00,
    subsystem: 'dmd',
  };
  const result = HardwareMapper.getAddress(0x3C00);
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

test('HardwareMapper, should get address, 0x3FC2', (t) => {
  const expectedResult = {
    offset: 0x3FC2,
    subsystem: 'externalIo',
  };
  const result = HardwareMapper.getAddress(0x3FC2);
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
