'use strict';

import test from 'ava';
import IoBoard from '../../../lib/boards/externalio-board';

test.beforeEach((t) => {
  t.context = IoBoard.getInstance();
});

test('externalIo, should read write to ticket dispense', (t) => {
  const offset = 0x3FC6 - 0x3FC0;
  const ioBoard = t.context;
  ioBoard.write(offset, 255);
  t.is(ioBoard.ram[offset], 0xFF);
});

test('externalIo, read from offset 0', (t) => {
  const ioBoard = t.context;
  const result = ioBoard.readInterface(0);
  t.is(result, 0);
});
