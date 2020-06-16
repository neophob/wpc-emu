'use strict';

const test = require('ava');
const DmdMapper = require('../../../../lib/boards/mapper/dmd');

test('DmdMapper, should get address, 0x3000', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    bank: 2,
  };
  const result = DmdMapper.getAddress(0x3000);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3200', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    bank: 3,
  };
  const result = DmdMapper.getAddress(0x3200);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3400', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    bank: 4,
  };
  const result = DmdMapper.getAddress(0x3400);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3600', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    bank: 5,
  };
  const result = DmdMapper.getAddress(0x3600);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3800', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    bank: 0,
  };
  const result = DmdMapper.getAddress(0x3800);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3A00', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    bank: 1,
  };
  const result = DmdMapper.getAddress(0x3A00);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3A00, should calculate offset correct', (t) => {
  const expectedResult = {
    offset: 1,
    subsystem: 'videoram',
    bank: 1,
  };
  const result = DmdMapper.getAddress(0x3A01);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3FB9', (t) => {
  const expectedResult = {
    offset: 0x3FB9,
    bank: undefined,
    subsystem: 'command',
  };
  const result = DmdMapper.getAddress(0x3FB9);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should throw when using invalid address, -1', (t) => {
  t.throws(() => DmdMapper.getAddress(-1), { message: 'INVALID_DMD_ADDRESSRANGE_-1' });
});
