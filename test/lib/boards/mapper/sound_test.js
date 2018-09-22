'use strict';

import test from 'ava';
import SoundMapper from '../../../../lib/boards/mapper/sound';

test('SoundMapper, should fail when using invalid offset', (t) => {
  t.throws(SoundMapper.getAddress, 'SND_GET_ADDRESS_UNDEFINED');
});

test('SoundMapper, should get address, -1', (t) => {
  const expectedResult = {
    offset: 16383,
    subsystem: 'rom',
  };
  const result = SoundMapper.getAddress(-1);
  t.deepEqual(result, expectedResult);
});

test('SoundMapper, should get address, 0x10000', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'ram',
  };
  const result = SoundMapper.getAddress(0x10000);
  t.deepEqual(result, expectedResult);
});

test('SoundMapper, should get address, 0x0', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'ram',
  };
  const result = SoundMapper.getAddress(0x0);
  t.deepEqual(result, expectedResult);
});

test('SoundMapper, should get address, 0x2000', (t) => {
  const expectedResult = {
    offset: 0x2000,
    subsystem: 'hardware',
  };
  const result = SoundMapper.getAddress(0x2000);
  t.deepEqual(result, expectedResult);
});

test('SoundMapper, should get address, 0x2400', (t) => {
  const expectedResult = {
    offset: 0x2400,
    subsystem: 'hardware',
  };
  const result = SoundMapper.getAddress(0x2400);
  t.deepEqual(result, expectedResult);
});

test('SoundMapper, should get address, 0x2401', (t) => {
  const expectedResult = {
    offset: 0x2401,
    subsystem: 'hardware',
  };
  const result = SoundMapper.getAddress(0x2401);
  t.deepEqual(result, expectedResult);
});

test('SoundMapper, should get address, 0x2402', (t) => {
  const expectedResult = {
    offset: 0x2400,
    subsystem: 'hardware',
  };
  const result = SoundMapper.getAddress(0x2402);
  t.deepEqual(result, expectedResult);
});

test('SoundMapper, should get address, 0x24ff', (t) => {
  const expectedResult = {
    offset: 0x2401,
    subsystem: 'hardware',
  };
  const result = SoundMapper.getAddress(0x24FF);
  t.deepEqual(result, expectedResult);
});

test('SoundMapper, should get address, 0x4000', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'bank',
  };
  const result = SoundMapper.getAddress(0x4000);
  t.deepEqual(result, expectedResult);
});

test('SoundMapper, should get address, 0xC000', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'rom',
  };
  const result = SoundMapper.getAddress(0xC000);
  t.deepEqual(result, expectedResult);
});
