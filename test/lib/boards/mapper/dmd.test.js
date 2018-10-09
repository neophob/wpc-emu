'use strict';

import test from 'ava';
import DmdMapper from '../../../../lib/boards/mapper/dmd';

test('DmdMapper, should get address, 0x3000', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    page: 2,
  };
  const result = DmdMapper.getAddress(0x3000);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3200', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    page: 3,
  };
  const result = DmdMapper.getAddress(0x3200);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3400', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    page: 4,
  };
  const result = DmdMapper.getAddress(0x3400);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3600', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    page: 5,
  };
  const result = DmdMapper.getAddress(0x3600);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3800', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    page: 0,
  };
  const result = DmdMapper.getAddress(0x3800);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3A00', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'videoram',
    page: 1,
  };
  const result = DmdMapper.getAddress(0x3A00);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3A00, should calculate offset correct', (t) => {
  const expectedResult = {
    offset: 1,
    subsystem: 'videoram',
    page: 1,
  };
  const result = DmdMapper.getAddress(0x3A01);
  t.deepEqual(result, expectedResult);
});

test('DmdMapper, should get address, 0x3FB9', (t) => {
  const expectedResult = {
    offset: 0x3FB9,
    page: undefined,
    subsystem: 'command',
  };
  const result = DmdMapper.getAddress(0x3FB9);
  t.deepEqual(result, expectedResult);
});
