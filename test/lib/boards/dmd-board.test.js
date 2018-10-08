'use strict';

import test from 'ava';
import DMD from '../../../lib/boards/dmd-board';

test.beforeEach((t) => {
  const ram = new Uint8Array(0x4000);
  const initObject = {
    interruptCallback: {},
    ram,
  };
  const dmd = DMD.getInstance(initObject);
  dmd.reset();
  t.context = dmd;
});

test('dmd, should write to hardwareRam', (t) => {
  const dmd = t.context;
  dmd.write(0x3FBD, 255);
  t.is(dmd.ram[0x3FBD], 0xFF);
});

test('dmd, should read to WPC_DMD_SCANLINE', (t) => {
  const dmd = t.context;
  const result = dmd.read(0x3FBD);
  t.is(result, 0x0);
});

test('dmd, should map WPC_DMD_LOW_PAGE', (t) => {
  const dmd = t.context;
  const result = dmd.write(DMD.OP.WPC_DMD_LOW_PAGE, 2);
  t.is(dmd.dmdPageMapping[0], 2);
});

test('dmd, should map WPC_DMD_LOW_PAGE, wrap value', (t) => {
  const dmd = t.context;
  const result = dmd.write(DMD.OP.WPC_DMD_LOW_PAGE, 0xFF);
  t.is(dmd.dmdPageMapping[0], 0xF);
});

test('dmd, should map WPC_DMD_HIGH_PAGE', (t) => {
  const dmd = t.context;
  const result = dmd.write(DMD.OP.WPC_DMD_HIGH_PAGE, 3);
  t.is(dmd.dmdPageMapping[1], 3);
});

test('dmd, should map WPC95_DMD_PAGE3000', (t) => {
  const dmd = t.context;
  const result = dmd.write(DMD.OP.WPC95_DMD_PAGE3000, 5);
  t.is(dmd.dmdPageMapping[2], 5);
});

test('dmd, should map WPC95_DMD_PAGE3200', (t) => {
  const dmd = t.context;
  const result = dmd.write(DMD.OP.WPC95_DMD_PAGE3200, 6);
  t.is(dmd.dmdPageMapping[3], 6);
});

test('dmd, should map WPC95_DMD_PAGE3400', (t) => {
  const dmd = t.context;
  const result = dmd.write(DMD.OP.WPC95_DMD_PAGE3400, 7);
  t.is(dmd.dmdPageMapping[4], 7);
});

test('dmd, should map WPC95_DMD_PAGE3600', (t) => {
  const dmd = t.context;
  const result = dmd.write(DMD.OP.WPC95_DMD_PAGE3600, 8);
  t.is(dmd.dmdPageMapping[5], 8);
});

test('dmd, should write next active page, wrap around', (t) => {
  const dmd = t.context;
  const result = dmd.write(DMD.OP.WPC_DMD_ACTIVE_PAGE, 0xFF);
  t.is(dmd.nextActivePage, 0xF);
});
