'use strict';

import test from 'ava';
import { findString, findUint8 } from '../../../../scripts/ui/ui/search';

test('findString: find string', (t) => {
  const result = findString('AAA', new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.is(result, 1);
});

test('findString: find no string', (t) => {
  const result = findString('BBB', new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.is(result, 0);
});

test('findString: find no string (empty array)', (t) => {
  const result = findString('BBB', new Uint8Array());
  t.is(result, 0);
});

test('findUint8: find zero value', (t) => {
  const result = findUint8(4, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.is(result, 0);
});

test('findUint8: find one value', (t) => {
  const result = findUint8(1, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.is(result, 1);
});

test('findUint8: find multiple value', (t) => {
  const result = findUint8(65, new Uint8Array([0, 1, 2, 3, 65, 65, 65]));
  t.is(result, 3);
});
