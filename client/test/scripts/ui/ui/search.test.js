import test from 'ava';
import {
  findString,
  findUint8,
  findUint16,
  findUint32,
  findIdenticalOffsetInArray,
  findBCD,
} from '../../../../scripts/ui/ui/search.js';

test('findString: find no string', t => {
  const result = findString('BBB', new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.is(result.length, 0);
});

test('findString: find no string (empty array)', t => {
  const result = findString('BBB', new Uint8Array());
  t.is(result.length, 0);
});

test('findString: find one string', t => {
  const result = findString('AAA', new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [4]);
});

test('findString: find multiple strings', t => {
  const result = findString('AAA', new Uint8Array([0, 1, 2, 3, 65, 65, 65, 65]));
  t.deepEqual(result, [4, 5]);
});

test('findUint8: find zero value', t => {
  const result = findUint8(4, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.is(result.length, 0);
});

test('findUint8: find zero value (empty areary)', t => {
  const result = findUint8(4, new Uint8Array());
  t.is(result.length, 0);
});

test('findUint8: find one value', t => {
  const result = findUint8(1, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [1]);
});

test('findUint8: find multiple value', t => {
  const result = findUint8(65, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [4, 5, 6]);
});

test('findUint16: find zero value', t => {
  const result = findUint16(0x13_30, new Uint8Array([0x13, 0x37]));
  t.is(result.length, 0);
});

test('findUint16: find zero value (empty array)', t => {
  const result = findUint16(0x13_30, new Uint8Array());
  t.is(result.length, 0);
});

test('findUint16: find one value', t => {
  const result = findUint16(0x13_37, new Uint8Array([0x0, 0x13, 0x37]));
  t.deepEqual(result, [1]);
});

test('findUint16: find multiple value', t => {
  const result = findUint16(0x13_37, new Uint8Array([0x13, 0x37, 0x33, 0x13, 0x37]));
  t.deepEqual(result, [0, 3]);
});

test('findUint32: find zero value', t => {
  const result = findUint32(0x13_30_22_33, new Uint8Array([0x13, 0x38, 0x22, 0x33]));
  t.is(result.length, 0);
});

test('findUint32: find zero value (empty array)', t => {
  const result = findUint32(0x13_30_22_33, new Uint8Array());
  t.is(result.length, 0);
});

test('findUint32: find one value', t => {
  const result = findUint32(0x13_30_22_33, new Uint8Array([0x13, 0x30, 0x22, 0x33]));
  t.deepEqual(result, [0]);
});

test('findUint32: find multiple value', t => {
  const result = findUint32(0x13_30_22_33, new Uint8Array([0x13, 0x30, 0x22, 0x33, 0x00, 0x13, 0x30, 0x22, 0x33]));
  t.deepEqual(result, [0, 5]);
});

test('findBCD: find zero value', t => {
  const result = findBCD('6220', new Uint8Array([0x13]));
  t.is(result.length, 0);
});

test('findBCD: find zero value (empty array)', t => {
  const result = findBCD('6220', new Uint8Array());
  t.is(result.length, 0);
});

test('findBCD: find one value', t => {
  const result = findBCD('2345', new Uint8Array([0x23, 0x45]));
  t.deepEqual(result, [0]);
});

test('findBCD: find multiple value', t => {
  const result = findBCD('2345', new Uint8Array([0x23, 0x45, 0, 0x23, 0x45]));
  t.deepEqual(result, [0, 3]);
});

test('findBCD: find 1000020', t => {
  const result = findBCD('1000020', new Uint8Array([0, 0, 0, 0, 0, 0x1, 0x00, 0x00, 0x20, 0x3]));
  t.deepEqual(result, [5]);
});

test('findIdenticalOffsetInArray: find nothing', t => {
  const a1 = new Uint8Array([0x13, 0x30]);
  const a2 = new Uint8Array([]);
  const result = findIdenticalOffsetInArray(a1, a2);
  t.deepEqual(result, new Uint8Array([]));
});

test('findIdenticalOffsetInArray: find nothing (undefined 1)', t => {
  const a1 = new Uint8Array([0x13, 0x30]);
  const result = findIdenticalOffsetInArray(a1, undefined);
  t.deepEqual(result, new Uint8Array([]));
});

test('findIdenticalOffsetInArray: find nothing (undefined 2)', t => {
  const a1 = new Uint8Array([0x13, 0x30]);
  const result = findIdenticalOffsetInArray(undefined, a1);
  t.deepEqual(result, new Uint8Array([]));
});

test('findIdenticalOffsetInArray: find one same value', t => {
  const a1 = new Uint8Array([0x13, 0x30]);
  const a2 = new Uint8Array([0, 0x30, 0x40]);
  const result = findIdenticalOffsetInArray(a1, a2);
  t.deepEqual(result, new Uint8Array([0x30]));
});

test('findIdenticalOffsetInArray: find multiple values', t => {
  const a1 = new Uint8Array([0x13, 0x30, 0x40]);
  const a2 = new Uint8Array([0, 0x30, 0x40]);
  const result = findIdenticalOffsetInArray(a1, a2);
  t.deepEqual(result, new Uint8Array([0x30, 0x40]));
});
