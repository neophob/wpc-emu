'use strict';

import test from 'ava';
import dmdBlend from '../../../lib/boards/lib/dmd-blend';

/*jshint bitwise: false*/

const BLEND_DATA1 = [
  { plane: 2, ts: 41882.29999993928 },
  { plane: 1, ts: 41882.99999991432 },
  { event: 'end', ts: 41897.39999989979 },
];

const BLEND_DATA2 = [
  { plane: 2, ts: 86337.89999992587 },
  { plane: 3, ts: 86338.19999988191 },
  { plane: 1, ts: 86338.19999988191 },
  { event: 'end', ts: 86339.09999998286 },
];

const BLEND_DATA3 = [
  { plane: 1, ts: 10 },
  { plane: 2, ts: 15 },
  { plane: 2, ts: 20 },
  { event: 'end', ts: 22 },
];

const BLEND_DATA4 = [
  { plane: 1, ts: 0 },
  { event: 'end', ts: 10 },
];

test('blend test simple', (t) => {
  const result = dmdBlend.calc(BLEND_DATA1);
  t.is(result['1'], 0.9536423856376736);
  t.is(result['2'], 0.046357614362326355);
});

test('blend test, remove invalid plane', (t) => {
  const result = dmdBlend.calc(BLEND_DATA2);
  t.is(result['1'], 0.7500000485063818);
  t.is(result['2'], 0.24999995149361823);
  t.is(result['3'], undefined);
});

test('blend test, should add results', (t) => {
  const result = dmdBlend.calc(BLEND_DATA3);
  t.is(result['1'], 0.41666666666666663);
  t.is(result['2'], 0.5833333333333333);
});

test('blend test, minimal', (t) => {
  const result = dmdBlend.calc(BLEND_DATA4);
  t.is(result['1'], 1);
  t.is(result['2'], 0);
});

test('blend test, empty array', (t) => {
  const result = dmdBlend.calc([]);
  t.is(result.length, 0);
});

test('blend test, undefined', (t) => {
  const result = dmdBlend.calc();
  t.is(result.length, 0);
});
