'use strict';

import test from 'ava';
import SoundMapper from '../../../../lib/boards/mapper/sound';

test('SoundMapper, should fail when using invalid offset', (t) => {
  t.throws(SoundMapper.getAddress, 'SND_GET_ADDRESS_UNDEFINED');
});

test('SoundMapper, should get address, -1', (t) => {
  t.throws(() => SoundMapper.getAddress(-1), 'SND_GET_ADDRESS_INVALID_MEMORY_REGION_0x-1');
});

test('SoundMapper, should get address, 0x10000', (t) => {
  t.throws(() => SoundMapper.getAddress(0x10000), 'SND_GET_ADDRESS_INVALID_MEMORY_REGION_0x10000');
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
    offset: 8192,
    subsystem: 'hardware',
  };
  const result = SoundMapper.getAddress(0x2000);
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
