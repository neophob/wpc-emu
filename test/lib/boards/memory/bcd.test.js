const test = require('ava');
const bcd = require('../../../../lib/boards/memory/bcd');

test('BCD: toBCD, encode 12345 to BCD', (t) => {
  const result = bcd.toBCD('12345');
  t.deepEqual(result, new Uint8Array([ 0x01, 0x23, 0x45 ]));
});

test('BCD: toBCD, encode 1000020 to BCD', (t) => {
  const result = bcd.toBCD('1000020');
  t.deepEqual(result, new Uint8Array([ 0x01, 0x00, 0x00, 0x20 ]));
});

test('BCD: toNumber, 0x123456)', (t) => {
  const result = bcd.toNumber(new Uint8Array([ 0x12, 0x34, 0x56 ]));
  t.is(result, 123456);
});

test('BCD: toNumber, 0x1234)', (t) => {
  const result = bcd.toNumber(new Uint8Array([ 0x12, 0x34 ]));
  t.is(result, 1234);
});

test('BCD: toNumber, empty)', (t) => {
  const result = bcd.toNumber(new Uint8Array([]));
  t.is(result, 0);
});
