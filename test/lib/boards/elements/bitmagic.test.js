'use strict';

const test = require('ava');
const bitmagic = require('../../../../lib/boards/elements/bitmagic');

test('bitmagic, should get msb from 0x0A', (t) => {
  const result = bitmagic.findMsbBit(0x0A);
  t.is(result, 0);
});

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

test('bitmagic, should set msb 0', (t) => {
  const result = bitmagic.setMsbBit(0);
  t.is(result, 0x01);
});

test('bitmagic, should set msb for 3', (t) => {
  const result = bitmagic.setMsbBit(3);
  t.is(result, 0x08);
});

test('bitmagic, should set msb for 7', (t) => {
  const result = bitmagic.setMsbBit(7);
  t.is(result, 0x80);
});
