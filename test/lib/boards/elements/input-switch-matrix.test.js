'use strict';

import test from 'ava';
import InputSwitchMatrix from '../../../../lib/boards/elements/input-switch-matrix';

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
  t.is(inputSwitchMatrix.getFliptronicsKeys(), 0);
});

test('InputSwitchMatrix, getFliptronicsKeys', (t) => {
  const inputSwitchMatrix = t.context;
  inputSwitchMatrix.setFliptronicsInput('F0');
  inputSwitchMatrix.setFliptronicsInput('F6');
  t.is(inputSwitchMatrix.getFliptronicsKeys(), 32);
});

test('InputSwitchMatrix, getRow', (t) => {
  const inputSwitchMatrix = t.context;
  const result = inputSwitchMatrix.getRow(0);
  t.is(result, 0);
});

//TODO add setInputKey tests
