'use strict';

import { Howl } from 'howler';

export { SoundPlayer };

function SoundPlayer(audioData) {
  return new SoundCategory(audioData);
}

const NO_SOUND_AVAILABLE = 'NO SOUND AVAILABLE';
const SOUND_LOADING = 'SOUND LOADING...';
const SOUND_LOADED = 'SOUND LOADED';
const SOUND_LOADING_ERROR = 'SOUND LOADING ERROR';

class SoundCategory {

  constructor(audioData) {
    this.sample = audioData.sample;
    this.activePlayId = [];
    this.soundState = NO_SOUND_AVAILABLE;

    if (audioData.url.length === 0) {
      console.log('NO_SOUND_DATA');
      return;
    }

    this.soundState = SOUND_LOADING;

    this.soundLoaded = new Promise((resolve, reject) => {
      this.audioSpritePlayer = new Howl({
        src: FETCHURL + audioData.url,
        sprite: audioData.sprite,
        onplayerror: (error) => {
          console.log('SOUND PLAYER ERROR', error.message);
        },
        onloaderror: (error) => {
          this.soundState = SOUND_LOADING_ERROR;
          reject(error);
        },
        onload: () => {
          this.soundState = SOUND_LOADED;
          console.log('SOUND LOADED');
          resolve();
        },
      });
    });
  }

  playId(sampleData = {}) {
    if (this.soundState === NO_SOUND_AVAILABLE || !sampleData.sample) {
      return;
    }
    //TODO handle DUCK, GAIN
    let playId;
    const spriteId = sampleData.sample;
    const hasDedicatedChannel = Number.isInteger(sampleData.channel);
    if (hasDedicatedChannel) {
      console.log('has channel', sampleData)
      this.audioSpritePlayer.stop(this.activePlayId[sampleData.channel]);
      playId = this.audioSpritePlayer.play(spriteId);
      this.activePlayId[sampleData.channel] = playId;
    } else {
      playId = this.audioSpritePlayer.play(spriteId);
    }

    if (sampleData.loop) {
      console.log('will loop', sampleData)
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
    //TODO resume channel 1+2
    this.audioSpritePlayer.resume();
  }

  stopAll() {
    if (!this.soundEnabled) {
      return;
    }
    //TODO pause channel 1+2
    this.audioSpritePlayer.stop();
  }
}
