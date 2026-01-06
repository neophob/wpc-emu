import test from 'ava';
import browserEnv from 'browser-env';
import { initialise, save } from '../../../scripts/lib/pin2DmdExport.js';

test.before(() => {
  browserEnv();
});

test.beforeEach((t) => {
  t.context = initialise();
});

test('pin2DmdExport, should build export file', (t) => {
  t.context.addFrames([51, 52, 53], 1_547_335_816_154);
  const result = t.context.buildExportFile();
  const frameCount = t.context.getCapturedFrames();

  t.deepEqual(result, new Uint8Array([
    0x52,
    0x41,
    0x57,
    0x00,
    0x01,
    0x80,
    0x20,
    0x03,
    0x44,
    0x3C,
    0x1D,
    0x2E,
    0x33,
    0x34,
    0x35,
  ]));
  t.is(frameCount, 1);
});

test('pin2DmdExport, should not add duplicate frames', (t) => {
  t.context.addFrames([51, 52, 53], 1_547_335_816_154);
  t.context.addFrames([51, 52, 53], 1_547_335_816_155);
  const frameCount = t.context.getCapturedFrames();

  t.is(frameCount, 2);
});

test('pin2DmdExport, getCapturedFrames (empty)', (t) => {
  const result = t.context.getCapturedFrames();
  t.is(result, 0);
});

test('pin2DmdExport, do not export undefined frames', (t) => {
  const result = save();
  t.is(result, false);
});

test('pin2DmdExport, do not export empty frames', (t) => {
  const result = save(t.context.buildExportFile());
  t.is(result, false);
});
