'use strict';

import test from 'ava';
import SoundBoard from '../../../lib/boards/sound-board';

test.beforeEach((t) => {
  const ram = new Uint8Array(0x4000);
  const initObject = {
    interruptCallback: {},
    ram,
  };
  t.context = SoundBoard.getInstance(initObject);
});

test('externalIo, should read write to ticket dispense', (t) => {
  const soundBoard = t.context;
  soundBoard.write(0x3FC6, 255);
  t.is(soundBoard.ram[0x3FC6], 0xFF);
});

test('externalIo, read from soundboard', (t) => {
  const soundBoard = t.context;
  const result = soundBoard.read(0x3FDC);
  t.is(result, 0x0);
});
