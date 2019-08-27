'use strict';

import test from 'ava';
import { findString, findUint8, findUint16, findUint32 } from '../../../../scripts/ui/ui/search';

test('findString: find no string', (t) => {
  const result = findString('BBB', new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.is(result.length, 0);
});

test('findString: find no string (empty array)', (t) => {
  const result = findString('BBB', new Uint8Array());
  t.is(result.length, 0);
});

test('findString: find one string', (t) => {
  const result = findString('AAA', new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [ 4 ]);
});

test('findString: find multiple strings', (t) => {
  const result = findString('AAA', new Uint8Array([0, 1, 2, 3, 65, 65, 65, 65]));
  t.deepEqual(result, [ 4, 5 ]);
});

test('findUint8: find zero value', (t) => {
  const result = findUint8(4, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.is(result.length, 0);
});

test('findUint8: find zero value (empty areary)', (t) => {
  const result = findUint8(4, new Uint8Array());
  t.is(result.length, 0);
});

test('findUint8: find one value', (t) => {
  const result = findUint8(1, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [ 1 ]);
});

test('findUint8: find multiple value', (t) => {
  const result = findUint8(65, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.deepEqual(result, [ 4, 5, 6 ]);
});

test('findUint16: find zero value', (t) => {
  const result = findUint16(0x1330, new Uint8Array([0x13, 0x37]));
  t.is(result.length, 0);
});

test('findUint16: find zero value (empty array)', (t) => {
  const result = findUint16(0x1330, new Uint8Array());
  t.is(result.length, 0);
});

test('findUint16: find one value', (t) => {
  const result = findUint16(0x1337, new Uint8Array([0x0, 0x13, 0x37]));
  t.deepEqual(result, [ 1 ]);
});

test('findUint16: find multiple value', (t) => {
  const result = findUint16(0x1337, new Uint8Array([0x13, 0x37, 0x33, 0x13, 0x37]));
  t.deepEqual(result, [ 0, 3 ]);
});

test('findUint32: find zero value', (t) => {
  const result = findUint32(0x13302233, new Uint8Array([0x13, 0x38, 0x22, 0x33]));
  t.is(result.length, 0);
});

test('findUint32: find zero value (empty array)', (t) => {
  const result = findUint32(0x13302233, new Uint8Array());
  t.is(result.length, 0);
});

test('findUint32: find one value', (t) => {
  const result = findUint32(0x13302233, new Uint8Array([0x13, 0x30, 0x22, 0x33]));
  t.deepEqual(result, [ 0 ]);
});

test('findUint32: find multiple value', (t) => {
  const result = findUint32(0x13302233, new Uint8Array([0x13, 0x30, 0x22, 0x33, 0x00, 0x13, 0x30, 0x22, 0x33]));
  t.deepEqual(result, [ 0, 5 ]);
});
