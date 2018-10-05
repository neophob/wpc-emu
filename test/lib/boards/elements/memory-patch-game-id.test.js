'use strict';

import test from 'ava';
import MemoryPatch from '../../../../lib/boards/elements/memory-patch';
import MemoryPatchGameId from '../../../../lib/boards/elements/memory-patch-game-id';

test('MemoryPatchGameId, should return a patched game id', (t) => {
  const memoryPatch = MemoryPatch.getInstance();
  MemoryPatchGameId.run(memoryPatch, 0x50);
  const gameIdLo = memoryPatch.hasPatch(0x50);
  const gameIdHi = memoryPatch.hasPatch(0x51);
  t.is(gameIdLo.value, 20);
  t.is(gameIdHi.value, 99);
});
