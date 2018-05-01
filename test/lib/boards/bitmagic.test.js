'use strict';

import test from 'ava';
import bitmagic from '../../../lib/boards/bitmagic';

test('bitmagic, should get msb from 0x80', (t) => {
  const result = bitmagic.findMsbBit(0x80);
  t.is(result, 8);
});

test('bitmagic, should get msb from 0x01', (t) => {
  const result = bitmagic.findMsbBit(0x01);
  t.is(result, 1);
});

test('bitmagic, should get msb from 0x00', (t) => {
  const result = bitmagic.findMsbBit(0x00);
  t.is(result, 0);
});

test('bitmagic, should get msb from undefined', (t) => {
  const result = bitmagic.findMsbBit();
  t.is(result, 0);
});
