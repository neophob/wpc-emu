const test = require('ava');
const memoryProtection = require('../../../../lib/boards/elements/memory-protection');

test('memoryProtection, should get memoryProtection mask for 0', (t) => {
  const result = memoryProtection.getMemoryProtectionMask(0);
  t.is(result, 0x1000);
});

test('memoryProtection, should get memoryProtection mask for 1', (t) => {
  const result = memoryProtection.getMemoryProtectionMask(1);
  t.is(result, 0x1800);
});

test('memoryProtection, should get memoryProtection mask for 15', (t) => {
  const result = memoryProtection.getMemoryProtectionMask(15);
  t.is(result, 0x1F00);
});

test('memoryProtection, should get memoryProtection mask for 16', (t) => {
  const result = memoryProtection.getMemoryProtectionMask(16);
  t.is(result, 0x2000);
});

test('memoryProtection, should get memoryProtection mask for 17', (t) => {
  const result = memoryProtection.getMemoryProtectionMask(17);
  t.is(result, 0x2800);
});

test('memoryProtection, should get memoryProtection mask for 255 - unsure', (t) => {
  const result = memoryProtection.getMemoryProtectionMask(255);
  t.is(result, 0xF00);
});

test('memoryProtection, should get memoryProtection mask for 256 (wrap around)', (t) => {
  const result = memoryProtection.getMemoryProtectionMask(256);
  t.is(result, 0x1000);
});
