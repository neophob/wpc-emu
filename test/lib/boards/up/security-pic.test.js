const test = require('ava');
const SecurityPic = require('../../../../lib/boards/up/security-pic');

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

test('SecurityPic, read first row', (t) => {
  const securityPic = t.context;
  securityPic.reset();
  securityPic.write(0x16);
  const result = securityPic.read((offset) => offset);
  t.is(result, 1);
});

test('SecurityPic, read last row', (t) => {
  const securityPic = t.context;
  securityPic.reset();
  securityPic.write(0x1F);
  const result = securityPic.read((offset) => offset);
  t.is(result, 10);
});

test('SecurityPic, calculate initial serial numbers', (t) => {
  const securityPic = t.context;
  const expectedPicSerial = [
    197, 49, 52, 28,
    110, 0, 95, 1,
    253, 226, 18, 243,
    28, 0, 117, 178,
  ];
  t.deepEqual(securityPic.originalPicSerialNumber, new Uint8Array(expectedPicSerial));
  t.is(securityPic.serialNumberScrambler, 0xA5);
});
