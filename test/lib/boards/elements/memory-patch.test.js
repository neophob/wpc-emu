'use strict';

import test from 'ava';
import MemoryPatch from '../../../../lib/boards/elements/memory-patch';

test('memoryPatch, should not return a value', (t) => {
  const memoryPatch = MemoryPatch.getInstance();
  const result = memoryPatch.hasPatch(0);
  t.is(result, undefined);
});

test('memoryPatch, should return a patched value', (t) => {
  const memoryPatch = MemoryPatch.getInstance();
  memoryPatch.addPatch(0x50, 20);
  const result = memoryPatch.hasPatch(0x50);
  t.is(result.value, 20);
});
