'use strict';

import test from 'ava';
import SoundBoard from '../../../lib/boards/sound-board';

test.beforeEach((t) => {
  const ram = new Uint8Array(0x4000);
  const initObject = {
    interruptCallback: {},
    ram,
    romObject: {}
  };
  t.context = SoundBoard.getInstance(initObject);
});

/*
test('externalIo, should read write to ticket dispense', (t) => {
  const soundBoard = t.context;
  soundBoard.write(0x3FC6, 255);
  t.is(soundBoard.ram[0x3FC6], 0xFF);
});
*/

test('externalIo, read from soundboard', (t) => {
  const soundBoard = t.context;
  const result = soundBoard.readInterface(0x3FDC);
  t.is(result, 0xff);
});

test('should getBankRomOffset 124', (t) => {
  const soundBoard = t.context;
  const result = soundBoard._getBankRomOffset(124);
  t.is(result, 0x60000);
});

test('should getBankRomOffset 220', (t) => {
  const soundBoard = t.context;
  const result = soundBoard._getBankRomOffset(220);
  t.is(result, 0x160000);
});

test('should getBankRomOffset 221', (t) => {
  const soundBoard = t.context;
  const result = soundBoard._getBankRomOffset(221);
  t.is(result, 0x168000);
});

test('should getBankRomOffset 222', (t) => {
  const soundBoard = t.context;
  const result = soundBoard._getBankRomOffset(222);
  t.is(result, 0x170000);
});

test('should getBankRomOffset 223', (t) => {
  const soundBoard = t.context;
  const result = soundBoard._getBankRomOffset(223);
  t.is(result, 0x178000);
});
