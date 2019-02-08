'use strict';

import test from 'ava';
import SoundVolumeConvert from '../../../../lib/boards/elements/sound-volume-convert.js';

test('SoundVolumeConvert, convert min volume', (t) => {
  const result = SoundVolumeConvert.getRelativeVolume(0x00FF);
  t.is(result, 0);
});

test('SoundVolumeConvert, convert max volume', (t) => {
  const result = SoundVolumeConvert.getRelativeVolume(0xFF00);
  t.is(result, 31);
});

test('SoundVolumeConvert, refuse invalid volume', (t) => {
  const result = SoundVolumeConvert.getRelativeVolume(0xAAAA);
  t.is(result, undefined);
});