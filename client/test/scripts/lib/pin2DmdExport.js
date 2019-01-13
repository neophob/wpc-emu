'use strict';

import test from 'ava';
import { initialise } from '../../../scripts/lib/pin2DmdExport';

test.beforeEach((t) => {
  t.context = initialise()
});

test('pin2DmdExport, should build export file', (t) => {
  t.context.addFrames([51, 52, 53], 1547335816154);
  const result = t.context.buildExportFile();
  t.deepEqual(result, new Uint8Array([
    0x52, 0x41, 0x57, 0x00, 0x01, 0x80, 0x20, 0x03,
    0x01, 0x00, 0x00, 0x00, 0x33, 0x34, 0x35,
  ]));
});

test('pin2DmdExport, getCapturedFrames (empty)', (t) => {
  const result = t.context.getCapturedFrames();
  t.is(result, 0);
});

