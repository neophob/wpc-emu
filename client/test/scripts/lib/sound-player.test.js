'use strict';

import test from 'ava';

import { createSoundPlayer } from '../../../scripts/lib/sound-player';

const NO_SOUND = {
  url: [],
  sample: {},
  sprite: {},
};

test('soundPlayer, init without data', (t) => {
  const player = createSoundPlayer(NO_SOUND);
  t.is(player.soundState, 'NOT AVAILABLE');
});

test('soundPlayer, ignore play, pause, stopAll', (t) => {
  const player = createSoundPlayer(NO_SOUND);
  player.playId(2);
  player.pause();
  player.stopAll();
  t.is(player.soundEnabled, false);
});
