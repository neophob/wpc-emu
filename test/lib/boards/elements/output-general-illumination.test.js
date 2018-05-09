'use strict';

import test from 'ava';
import GeneralIllumination from '../../../../lib/boards/elements/output-general-illumination';

test.beforeEach((t) => {
  t.context = GeneralIllumination.getInstance();
});

test('generalIllumination, update with value 1', (t) => {
  const generalIllumination = t.context;
  generalIllumination.update(0x1);
  t.is(generalIllumination.generalIlluminationState[0], 0xFF);
  t.is(generalIllumination.generalIlluminationState[1], 0x00);
});

test('generalIllumination, update with value 0xCC', (t) => {
  const generalIllumination = t.context;
  generalIllumination.update(0xCC);
  t.is(generalIllumination.generalIlluminationState[0], 0x00);
  t.is(generalIllumination.generalIlluminationState[1], 0x00);
  t.is(generalIllumination.generalIlluminationState[2], 0xFF);
  t.is(generalIllumination.generalIlluminationState[3], 0xFF);
  t.is(generalIllumination.generalIlluminationState[4], 0x00);
  t.is(generalIllumination.generalIlluminationState[5], 0x00);
  t.is(generalIllumination.generalIlluminationState[6], 0xFF);
  t.is(generalIllumination.generalIlluminationState[7], 0xFF);
});

test('generalIllumination, update with values 0x2 and 0x4', (t) => {
  const generalIllumination = t.context;
  generalIllumination.update(0x2);
  generalIllumination.update(0x4);
  t.is(generalIllumination.generalIlluminationState[0], 0x00);
  t.is(generalIllumination.generalIlluminationState[1], 0x00);
  t.is(generalIllumination.generalIlluminationState[2], 0xFF);
  t.is(generalIllumination.generalIlluminationState[3], 0x00);
});

test('generalIllumination, update with values 0x4 and 0x4', (t) => {
  const generalIllumination = t.context;
  generalIllumination.update(0x4);
  generalIllumination.update(0x4);
  t.is(generalIllumination.generalIlluminationState[0], 0x00);
  t.is(generalIllumination.generalIlluminationState[1], 0x00);
  t.is(generalIllumination.generalIlluminationState[2], 0xFF);
  t.is(generalIllumination.generalIlluminationState[3], 0x00);
});
