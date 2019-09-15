'use strict';

import { Howl } from 'howler';
import { isMobileBrowser } from './device-detection';

export { createSoundPlayer };

function createSoundPlayer(audioData) {
  return new SoundCategory(audioData);
}

const NO_SOUND_AVAILABLE = 'N/A';
const NO_SOUND_AVAILABLE_ON_MOBILE = 'DISABLED ON MOBILE';
const SOUND_LOADING = 'LOADING...';
const SOUND_LOADED = 'LOADED';
const SOUND_LOADING_ERROR = 'ERROR';
const SOUNDSPRITE_PREFIX = 'snd';

class SoundCategory {

  constructor(audioData) {
    this.sample = audioData.sample;
    this.activePlayId = [];
    this.soundState = NO_SOUND_AVAILABLE;
    this.soundEnabled = false;

    if (audioData.url.length === 0) {
      console.log('NO_SOUND_DATA');
      return;
    }

    const isRunningOnMobile = isMobileBrowser();
    if (isRunningOnMobile) {
      this.soundState = NO_SOUND_AVAILABLE_ON_MOBILE;
      return;
    }

    this.soundState = SOUND_LOADING;

    this.soundLoaded = new Promise((resolve) => {
      const startTs = Date.now();
      this.audioSpritePlayer = new Howl({
        src: FETCHURL + audioData.url,
        sprite: audioData.sprite,
        format: ['mp3'],
        onplayerror: (error) => {
          console.log('SOUND PLAYER ERROR', error.message);
        },
        onloaderror: (error) => {
          this.soundState = SOUND_LOADING_ERROR;
          console.log('SOUND PLAYER LOAD ERROR', error);
        },
        onload: () => {
          this.soundState = SOUND_LOADED;
          this.soundEnabled = true;
          const loadTimeMs = Date.now() - startTs;
          console.log('SOUND LOADED', loadTimeMs);
          resolve();
        },
      });
    });
  }

  //TODO handle DUCK
  playId(sampleId) {
      if (!this.soundEnabled || !sampleId) {
      return;
    }
    const sampleData = this.sample[sampleId] || {};
    console.log('play', sampleData, sampleId);

    const hasDedicatedChannel = Number.isInteger(sampleData.channel);
    if (hasDedicatedChannel) {
      // stop previous track on this channel
      this.audioSpritePlayer.stop(this.activePlayId[sampleData.channel]);
    }

    //NOTE undefined samples are simply ignored
    const playId = this.audioSpritePlayer.play(SOUNDSPRITE_PREFIX + sampleId);

    if (hasDedicatedChannel) {
      // add id to queue
      this.activePlayId[sampleData.channel] = playId;
    }

    if (!hasDedicatedChannel || sampleData.gain) {
      const specificVolume = sampleData.gain || 0.5;
      this.audioSpritePlayer.volume(specificVolume, playId);
    }

    if (sampleData.loop) {
      this.audioSpritePlayer.loop(true, playId);
    }
  }

  pause() {
    if (!this.soundEnabled) {
      return;
    }
    this.audioSpritePlayer.pause();
  }

  resume() {
    if (!this.soundEnabled) {
      return;
    }
    this.activePlayId.forEach((activeId) => {
      this.audioSpritePlayer.play(activeId);
    });
  }

  stopAll() {
    if (!this.soundEnabled) {
      return;
    }
    //TODO pause channel 1+2
    this.audioSpritePlayer.stop();
  }
}
