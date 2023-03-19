const test = require('ava');
const MemoryPatch = require('../../../../lib/boards/elements/memory-patch');

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

test('memoryPatch, should remove a patched value', (t) => {
  const memoryPatch = MemoryPatch.getInstance();
  memoryPatch.addPatch(0x50, 20);
  memoryPatch.removePatch(0x50);
  const result = memoryPatch.hasPatch(0x50);
  t.is(result, undefined);
});

test('memoryPatch, should add a volatile patch', (t) => {
  const memoryPatch = MemoryPatch.getInstance();
  memoryPatch.addPatch(0x50, 20, true);
  const result = memoryPatch.hasPatch(0x50);
  t.is(result.value, 20);
});

test('memoryPatch, should cleanup volatile patches', (t) => {
  const memoryPatch = MemoryPatch.getInstance();
  memoryPatch.addPatch(0x50, 20, true);
  memoryPatch.addPatch(0x70, 21, true);
  memoryPatch.addPatch(0x90, 23);

  memoryPatch.removeVolatileEntries();
  const result1 = memoryPatch.hasPatch(0x50);
  const result2 = memoryPatch.hasPatch(0x70);
  const result3 = memoryPatch.hasPatch(0x90);
  t.is(result1, undefined);
  t.is(result2, undefined);
  t.is(result3.value, 23);
});

test('memoryPatch, should applyPatchesToExposedMemory', (t) => {
  const ram = new Uint8Array(20).fill(0);
  const memoryPatch = MemoryPatch.getInstance();
  memoryPatch.addPatch(10, 20, true);
  memoryPatch.addPatch(11, 21, true);

  const result = memoryPatch.applyPatchesToExposedMemory(ram);
  t.is(result[0], 0);
  t.is(result[10], 20);
  t.is(result[11], 21);
});
