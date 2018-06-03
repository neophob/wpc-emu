'use strict';

import test from 'ava';
import MemoryMapper from '../../../../lib/boards/mapper/memory';

test('MemoryMapper, should get address, 16322', (t) => {
  const expectedResult = {
    offset: 16322,
    subsystem: 'hardware',
  };
  const result = MemoryMapper.getAddress(16322);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 49090 - this crashes the emu', (t) => {
  const expectedResult = {
    offset: 49090,
    subsystem: 'system',
  };
  const result = MemoryMapper.getAddress(49090);
  t.deepEqual(result, expectedResult);
});
