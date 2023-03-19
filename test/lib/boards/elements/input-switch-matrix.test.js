const test = require('ava');
const InputSwitchMatrix = require('../../../../lib/boards/elements/input-switch-matrix');

test.beforeEach((t) => {
  t.context = InputSwitchMatrix.getInstance();
});

test('InputSwitchMatrix, setCabinetKey - 0x1', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setCabinetKey(0x1);
  t.is(inputSwitchMatrix.switchState[0], 1);
});

test('InputSwitchMatrix, setCabinetKey - 0x5', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setCabinetKey(0x5);
  t.is(inputSwitchMatrix.switchState[0], 5);
});

test('InputSwitchMatrix, getCabinetKey', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setCabinetKey(0x5);
  t.is(inputSwitchMatrix.getCabinetKey(), 5);
});

test('InputSwitchMatrix, setFliptronicsInput invalid', (t) => {
  const inputSwitchMatrix = t.context;
  t.is(inputSwitchMatrix.getFliptronicsKeys(), 255);
});

test('InputSwitchMatrix, setFliptronicsInput true', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setFliptronicsInput('F0', true);
  t.is(inputSwitchMatrix.getFliptronicsKeys(), 255);
});

test('InputSwitchMatrix, setFliptronicsInput false', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setFliptronicsInput('F0', false);
  t.is(inputSwitchMatrix.getFliptronicsKeys(), 255);
});

test('InputSwitchMatrix, getFliptronicsKeys - return inverted value', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setFliptronicsInput('F0');
  inputSwitchMatrix.setFliptronicsInput('F6');
  t.is(inputSwitchMatrix.getFliptronicsKeys(), 223);
});

test('InputSwitchMatrix, getRow', (t) => {
  const inputSwitchMatrix = t.context;
  const result = inputSwitchMatrix.getRow(0);
  t.is(result, 0);
});

test('InputSwitchMatrix, ignore invalid key setInputKey', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setInputKey(10);
  t.is(inputSwitchMatrix.switchState[1], 0);
});

test('InputSwitchMatrix, valid setInputKey', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setInputKey(25);
  t.is(inputSwitchMatrix.switchState[2], 24);
});

test('InputSwitchMatrix, setInputKey should set key', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setInputKey(25, true);
  t.is(inputSwitchMatrix.switchState[2], 24);
});

test('InputSwitchMatrix, setInputKey should clear key', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setInputKey(25, false);
  t.is(inputSwitchMatrix.switchState[2], 8);
});
