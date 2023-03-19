const test = require('ava');
const SolenoidMatrix = require('../../../../lib/boards/elements/output-solenoid-matrix');

const UPDATE_AFTER_TICKS = 8;

test.beforeEach((t) => {
  t.context = SolenoidMatrix.getInstance(UPDATE_AFTER_TICKS);
});

test('solenoidMatrix, update all high power solenoids', (t) => {
  const solenoidMatrix = t.context;
  solenoidMatrix.write(0x3FE1, 0xFF);
  t.is(solenoidMatrix.solenoidState[0], 0xFF);
  t.is(solenoidMatrix.solenoidState[7], 0xFF);
  t.is(solenoidMatrix.solenoidState[8], 0);
});

test('solenoidMatrix, update all low power solenoids', (t) => {
  const solenoidMatrix = t.context;
  solenoidMatrix.write(0x3FE3, 0xFF);
  t.is(solenoidMatrix.solenoidState[7], 0);
  t.is(solenoidMatrix.solenoidState[8], 0xFF);
  t.is(solenoidMatrix.solenoidState[15], 0xFF);
});

test('solenoidMatrix, update all flashlight solenoids', (t) => {
  const solenoidMatrix = t.context;
  solenoidMatrix.write(0x3FE2, 0xFF);
  t.is(solenoidMatrix.solenoidState[15], 0);
  t.is(solenoidMatrix.solenoidState[16], 0xFF);
  t.is(solenoidMatrix.solenoidState[23], 0xFF);
});

test('solenoidMatrix, update all generic solenoids', (t) => {
  const solenoidMatrix = t.context;
  solenoidMatrix.write(0x3FE0, 0xFF);
  t.is(solenoidMatrix.solenoidState[23], 0);
  t.is(solenoidMatrix.solenoidState[24], 0xFF);
  t.is(solenoidMatrix.solenoidState[31], 0xFF);
});

test('solenoidMatrix, update fliptronics solenoids', (t) => {
  const solenoidMatrix = t.context;
  solenoidMatrix.writeFliptronic(0xFF);
  t.is(solenoidMatrix.solenoidState[31], 0);
  t.is(solenoidMatrix.solenoidState[32], 0xFF);
  t.is(solenoidMatrix.solenoidState[33], 0xFF);
  t.is(solenoidMatrix.solenoidState[39], 0xFF);
});

test('solenoidMatrix, fail if value exceeds unsigned byte range', (t) => {
  const solenoidMatrix = t.context;
  t.throws(() => solenoidMatrix.write(0x3FE0, 0xFFF));
});

test('solenoidMatrix, fail if address is invalid', (t) => {
  const solenoidMatrix = t.context;
  t.throws(() => solenoidMatrix.write(0, 0xFF));
});

test('solenoidMatrix, update cycles', (t) => {
  const solenoidMatrix = t.context;
  solenoidMatrix.write(0x3FE1, 0xFF);
  solenoidMatrix.executeCycle(UPDATE_AFTER_TICKS);
  t.is(solenoidMatrix.solenoidState[0], 0x7F);
});
