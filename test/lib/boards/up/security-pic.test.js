'use strict';

import test from 'ava';
import SecurityPic from '../../../../lib/boards/up/security-pic';

const MACHINE_SERIAL = 530;

test.beforeEach((t) => {
  t.context = SecurityPic.getInstance(MACHINE_SERIAL);
});

test('SecurityPic, reset', (t) => {
  const securityPic = t.context;
  securityPic.reset();
  t.is(securityPic.lastByteWrite, 0xFF);
});

test('SecurityPic, invalid read after reset', (t) => {
  const securityPic = t.context;
  securityPic.reset();
  const result = securityPic.read();
  t.is(result, 0);
});

test('SecurityPic, read serial number', (t) => {
  const WPC_PIC_RESET = 0x00;
  const securityPic = t.context;
  securityPic.reset();
  securityPic.write(WPC_PIC_RESET);
  securityPic.write(0x7F);
  const result = securityPic.read();
  t.is(result, 178);
});

test('SecurityPic, calculate initial serial numbers', (t) => {
  const securityPic = t.context;
  const expectedGameSerial = [
    5,3,0,1,
    2,3,4,5,
    6,1,2,3,
    4,5,1,2,
    3
  ];
  const expectedPicSerial = [
    26, 40, 0, 27,
    110, 0, 91, 1,
    85, 208, 0, 45,
    23, 0, 255, 178
  ];
  t.deepEqual(securityPic.gameSerialNumber, new Uint8Array(expectedGameSerial));
  t.deepEqual(securityPic.picSerialNumber, new Uint8Array(expectedPicSerial));
});
