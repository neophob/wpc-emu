const test = require('ava');
const SoundVolumeConvert = require('../../../../lib/boards/elements/sound-volume-convert');

test('SoundVolumeConvert DCS, convert min volume', (t) => {
  const result = SoundVolumeConvert.getRelativeVolumeDcs(0x00, 0xFF);
  t.is(result, 0);
});

test('SoundVolumeConvert DCS, convert max volume', (t) => {
  const result = SoundVolumeConvert.getRelativeVolumeDcs(0xFF, 0x00);
  t.is(result, 31);
});

test('SoundVolumeConvert DCS, refuse invalid volume', (t) => {
  const result = SoundVolumeConvert.getRelativeVolumeDcs(0xAA, 0xAA);
  t.is(result, undefined);
});

test('SoundVolumeConvert preDCS, convert min volume', (t) => {
  const result = SoundVolumeConvert.getRelativeVolumePreDcs(0x00, 0xFF);
  t.is(result, 0);
});

test('SoundVolumeConvert preDCS, convert max volume', (t) => {
  const result = SoundVolumeConvert.getRelativeVolumePreDcs(0x1F, 0xE0);
  t.is(result, 31);
});

test('SoundVolumeConvert preDCS, refuse invalid volume', (t) => {
  const result = SoundVolumeConvert.getRelativeVolumePreDcs(1, 1);
  t.is(result, undefined);
});
