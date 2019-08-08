'use strict';

import test from 'ava';
import GeneralIllumination from '../../../../lib/boards/elements/output-general-illumination';

test.beforeEach((t) => {
  t.context.preWpc95 = GeneralIllumination.getInstance();
  t.context.wpc95 = GeneralIllumination.getInstance(true);
});

test('generalIllumination, update with value 0', (t) => {
  const generalIllumination = t.context.preWpc95;
  generalIllumination.update(0x0);
  t.is(generalIllumination.generalIlluminationState[0], 0x00);
  t.is(generalIllumination.generalIlluminationState[1], 0x00);
  t.is(generalIllumination.generalIlluminationState[2], 0x00);
  t.is(generalIllumination.generalIlluminationState[3], 0x00);
  t.is(generalIllumination.generalIlluminationState[4], 0x00);
  t.is(generalIllumination.generalIlluminationState[5], 0x00);
  t.is(generalIllumination.generalIlluminationState[6], 0x00);
  t.is(generalIllumination.generalIlluminationState[7], 0x00);
});

test('generalIllumination wpc95, update with value 0', (t) => {
  const generalIllumination = t.context.wpc95;
  generalIllumination.update(0x0);
  t.is(generalIllumination.generalIlluminationState[0], 0x00);
  t.is(generalIllumination.generalIlluminationState[1], 0x00);
  t.is(generalIllumination.generalIlluminationState[2], 0x00);
  t.is(generalIllumination.generalIlluminationState[3], 0x07);
  t.is(generalIllumination.generalIlluminationState[4], 0x07);
  t.is(generalIllumination.generalIlluminationState[5], 0x00);
  t.is(generalIllumination.generalIlluminationState[6], 0x00);
  t.is(generalIllumination.generalIlluminationState[7], 0x00);
});

test('generalIllumination, update with value 0xFF', (t) => {
  const generalIllumination = t.context.preWpc95;
  generalIllumination.update(0xFF);
  t.is(generalIllumination.generalIlluminationState[0], 0x07);
  t.is(generalIllumination.generalIlluminationState[1], 0x07);
  t.is(generalIllumination.generalIlluminationState[2], 0x07);
  t.is(generalIllumination.generalIlluminationState[3], 0x07);
  t.is(generalIllumination.generalIlluminationState[4], 0x07);
  t.is(generalIllumination.generalIlluminationState[5], 0x00);
  t.is(generalIllumination.generalIlluminationState[6], 0x00);
  t.is(generalIllumination.generalIlluminationState[7], 0x00);
});

test('generalIllumination wpc95, update with value 0xFF', (t) => {
  const generalIllumination = t.context.wpc95;
  generalIllumination.update(0xFF);
  t.is(generalIllumination.generalIlluminationState[0], 0x07);
  t.is(generalIllumination.generalIlluminationState[1], 0x07);
  t.is(generalIllumination.generalIlluminationState[2], 0x07);
  t.is(generalIllumination.generalIlluminationState[3], 0x07);
  t.is(generalIllumination.generalIlluminationState[4], 0x07);
  t.is(generalIllumination.generalIlluminationState[5], 0x00);
  t.is(generalIllumination.generalIlluminationState[6], 0x00);
  t.is(generalIllumination.generalIlluminationState[7], 0x00);
});

test('generalIllumination, update with values 0x2 and 0x4', (t) => {
  const generalIllumination = t.context.preWpc95;
  generalIllumination.update(0x2);
  generalIllumination.update(0x4);
  t.is(generalIllumination.generalIlluminationState[0], 0x00);
  t.is(generalIllumination.generalIlluminationState[1], 0x06);
  t.is(generalIllumination.generalIlluminationState[2], 0x07);
  t.is(generalIllumination.generalIlluminationState[3], 0x00);
});

test('generalIllumination, update with values 0x4 and 0x4', (t) => {
  const generalIllumination = t.context.preWpc95;
  generalIllumination.update(0x4);
  generalIllumination.update(0x4);
  t.is(generalIllumination.generalIlluminationState[0], 0x00);
  t.is(generalIllumination.generalIlluminationState[1], 0x00);
  t.is(generalIllumination.generalIlluminationState[2], 0x07);
  t.is(generalIllumination.generalIlluminationState[3], 0x00);
});

test('generalIllumination, getUint8ArrayFromState', (t) => {
  const generalIllumination = t.context.preWpc95;
  const result = generalIllumination.getUint8ArrayFromState([ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ]);
  t.deepEqual(result, Uint8Array.from([8, 8, 8, 8, 8, 8, 8, 8]));
});

test('generalIllumination, should decrease value (dim)', (t) => {
  const generalIllumination = t.context.preWpc95;
  generalIllumination.update(0xFF);
  generalIllumination.update(0x00);
  generalIllumination.update(0x00);
  t.is(generalIllumination.generalIlluminationState[0], 0x05);
  t.is(generalIllumination.generalIlluminationState[1], 0x05);
  t.is(generalIllumination.generalIlluminationState[2], 0x05);
  t.is(generalIllumination.generalIlluminationState[3], 0x05);
  t.is(generalIllumination.generalIlluminationState[4], 0x05);
  t.is(generalIllumination.generalIlluminationState[5], 0x00);
  t.is(generalIllumination.generalIlluminationState[6], 0x00);
  t.is(generalIllumination.generalIlluminationState[7], 0x00);
});
