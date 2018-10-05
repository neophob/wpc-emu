'use strict';

import test from 'ava';
import MemoryPatch from '../../../../lib/boards/elements/memory-patch';

test('memoryPatch, should not return a value', (t) => {
  const memoryPatch = MemoryPatch.getInstance();
  const result = memoryPatch.hasPatch(0);
  t.is(result, undefined);
});

test('memoryPatch, should return a patched value', (t) => {
  const memoryPatch = MemoryPatch.getInstance(0x50);
  const gameIdLo = memoryPatch.hasPatch(0x50);
  const gameIdHi = memoryPatch.hasPatch(0x51);
  t.is(gameIdLo.value, 20);
  t.is(gameIdHi.value, 99);
});
