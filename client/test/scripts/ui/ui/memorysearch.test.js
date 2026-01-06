import test from 'ava';
import {
  memoryFindData,
  clearSearchResults,
} from '../../../../scripts/ui/ui/memorysearch.js';

test('memoryFindData: find string', (t) => {
  const result = memoryFindData('AAA', 'string', false, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [4]);
});

test('memoryFindData: find uint8', (t) => {
  const result = memoryFindData(3, 'uint8', false, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [3]);
});

test('memoryFindData: find uint16', (t) => {
  const result = memoryFindData(0x03_41, 'uint16', false, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [3]);
});

test('memoryFindData: find uint32', (t) => {
  const result = memoryFindData(0x03_41_41_41, 'uint32', false, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [3]);
});

test('memoryFindData: find bcd', (t) => {
  const result = memoryFindData(6565, 'bcd', false, new Uint8Array([0, 1, 2, 3, 0x65, 0x65, 65]));
  t.deepEqual(result, [4]);
});

test('memoryFindData: find invalid', (t) => {
  const result = memoryFindData(1, 'foo', false, new Uint8Array([0, 1, 2, 3]));
  t.deepEqual(result, []);
});

test.serial('memoryFindData: find uint8 and remember results, 2 steps, simple', (t) => {
  clearSearchResults();

  const result1 = memoryFindData(3, 'uint8', true, new Uint8Array([0, 1, 2, 3, 4, 5, 6]));
  const result2 = memoryFindData(99, 'uint8', true, new Uint8Array([0, 1, 2, 99, 4, 5, 6]));

  t.is(result1.length, 0);
  t.deepEqual(result2, [3]);
});

test.serial('memoryFindData: find uint8 and remember results, 2 steps, advanced', (t) => {
  clearSearchResults();

  memoryFindData(2, 'uint8', true, new Uint8Array([0, 3, 0, 2, 2, 2, 2]));
  const result = memoryFindData(3, 'uint8', true, new Uint8Array([0, 3, 0, 2, 3, 3, 2]));
  t.deepEqual(result, [4, 5]);
});

test.serial('memoryFindData: find uint8 and remember results, 3 steps, advanced', (t) => {
  clearSearchResults();
  const search2 = new Uint8Array([0, 0, 0, 2, 2, 2, 2]);
  const search4 = new Uint8Array([4, 4, 4, 4, 4, 2, 0]);
  const search8 = new Uint8Array([0, 8, 0, 8, 0, 8, 8]);

  memoryFindData(2, 'uint8', true, search2);
  memoryFindData(4, 'uint8', true, search4);
  const result = memoryFindData(8, 'uint8', true, search8);

  t.deepEqual(result, [3]);
});
