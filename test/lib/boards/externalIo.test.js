'use strict';

import test from 'ava';
import ExternalIo from '../../../lib/boards/externalIo';

test.beforeEach((t) => {
  const ram = new Uint8Array(0x4000);
  const initObject = {
    interruptCallback: {},
    ram,
  };
  const externalIo = ExternalIo.getInstance(initObject);
  t.context = externalIo;
});

test('externalIo, should read write to ticket dispense', (t) => {
  const externalIo = t.context;
  externalIo.write(0x3FC6, 255);
  t.is(externalIo.ram[0x3FC6], 0xFF);
});

test('externalIo, read from soundboard', (t) => {
  const externalIo = t.context;
  const result = externalIo.read(0x3FDC);
  t.is(result, 0x0);
});
