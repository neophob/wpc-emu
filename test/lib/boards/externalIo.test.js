'use strict';

import test from 'ava';
import IoBoard from '../../../lib/boards/externalIo';

test.beforeEach((t) => {
  t.context = IoBoard.getInstance();
});

test('externalIo, should read write to ticket dispense', (t) => {
  const offset = 0x3FC6;
  const ioBoard = t.context;
  ioBoard.write(offset, 255);
  const result = ioBoard.read(offset);
  t.is(result, 0xFF);
});
