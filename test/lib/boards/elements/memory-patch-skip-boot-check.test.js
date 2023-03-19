const test = require('ava');
const MemoryPatch = require('../../../../lib/boards/elements/memory-patch');
const MemoryPatchSkipBootCheck = require('../../../../lib/boards/elements/memory-patch-skip-boot-check');

test('MemoryPatchSkipBootCheck, should return a patched game id', (t) => {
  const memoryPatch = MemoryPatch.getInstance();
  MemoryPatchSkipBootCheck.run(memoryPatch);
  const checkLo = memoryPatch.hasPatch(0xFFEC);
  const checkHi = memoryPatch.hasPatch(0xFFED);
  t.is(checkLo.value, 0x00);
  t.is(checkHi.value, 0xFF);
});
