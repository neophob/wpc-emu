'use strict';

import test from 'ava';
import WPC from '../../../lib/boards/wpc';


test.beforeEach((t) => {
  const ram = new Uint8Array(0x4000);
  const initObject = {
    interruptCallback: {},
    ram,
  };
  const wpc = WPC.getInstance(2, initObject);
  t.context = wpc;
});

test('wpc, should set zerocross flag', (t) => {
  const wpc = t.context;
  wpc.setZeroCrossFlag();
  t.is(wpc.zeroCrossFlag, 1);
});

test('wpc, should clear zerocross flag when read', (t) => {
  const wpc = t.context;
  wpc.setZeroCrossFlag();
  const result = wpc.read(WPC.OP.WPC_ZEROCROSS_IRQ_CLEAR);
  t.is(result, 128);
  t.is(wpc.zeroCrossFlag, 0);
});

test('wpc, should respect old zerocross flag state when read', (t) => {
  const wpc = t.context;
  wpc.write(WPC.OP.WPC_ZEROCROSS_IRQ_CLEAR, 0x7f);
  wpc.setZeroCrossFlag();
  const result = wpc.read(WPC.OP.WPC_ZEROCROSS_IRQ_CLEAR);
  t.is(result, 0xff);
  t.is(wpc.zeroCrossFlag, 0);
});
