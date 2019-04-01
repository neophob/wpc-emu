'use strict';

import test from 'ava';
import browserEnv from 'browser-env';
// NOTE: Import Howler to avoid error "message: 'HowlerGlobal is not defined'"
import { Howler } from 'howler';

browserEnv();

let createSoundPlayer;

test.before(() => {
  const player = require('../../../scripts/lib/sound-player');
  createSoundPlayer = player.createSoundPlayer;
});

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
