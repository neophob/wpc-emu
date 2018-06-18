'use strict';

import test from 'ava';
import SoundBoard from '../../../lib/boards/sound-board';

test.beforeEach((t) => {
  const initObject = {
    interruptCallback: {},
    romObject: {
      concatinatedSoundRom: new Uint8Array(0x80000 * 3).fill(0xff),
      soundSystemRom: new Uint8Array(0x4000).fill(0xff),
    },
  };
  t.context = SoundBoard.getInstance(initObject);
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

/*
test('should getBankRomOffset 223', (t) => {
  const soundBoard = t.context;
  for (let i=0; i<256; i++) {
    try {
      const result = soundBoard._getBankRomOffset(i);
      console.log('>>',i,':',result,'->',result/32768);
    } catch(error) {
      console.log('>>',i,':',error.message);
    }
  }
});
*/
