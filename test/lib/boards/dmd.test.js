'use strict';

import test from 'ava';
import DMD from '../../../lib/boards/dmd';


test.beforeEach((t) => {
  const dmd = DMD.getInstance();
  t.context = dmd;
});

test('dmd, should write to genericState', (t) => {
  const dmd = t.context;
  dmd.write(0x3fbd, 255);
  t.is(dmd.genericState[0x3fbd], 0xFF);
});

test('dmd, should read to WPC_DMD_SCANLINE', (t) => {
  const dmd = t.context;
  const result = dmd.read(0x3FBD);
  t.is(result, 0x0);
});
