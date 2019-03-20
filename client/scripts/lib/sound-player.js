'use strict';

import { Howl } from 'howler';

export { SoundPlayer };

function SoundPlayer(audioData) {
  return new SoundCategory(audioData);
}

class SoundCategory {

  constructor(audioData) {
    this.sample = audioData.sample;
    this.activePlayId = [];
    this.soundEnabled = false;

    if (audioData.url.length === 0) {
      console.log('NO_SOUND_DATA');
      return;
    }

    this.soundLoaded = new Promise((resolve, reject) => {
      this.audioSpritePlayer = new Howl({
        src: audioData.url,
        sprite: audioData.sprite,
        onplayerror: (error) => {
          console.log('SOUND PLAYER ERROR', error.message);
        },
        onloaderror: (error) => {
          reject(error);
        },
        onload: () => {
          this.soundEnabled = true;
          console.log('SOUND LOADED');
          resolve();
        },
      });
    });
  }

  playId(sampleData) {
    if (!this.soundEnabled) {
      return;
    }
    //TODO handle loop, channel
    const spriteId = sampleData.sample;
    this.audioSpritePlayer.play(spriteId);
  }

  pause() {
    if (!this.soundEnabled) {
      return;
    }
    this.audioSpritePlayer.pause();
  }

  stopAll() {
    if (!this.soundEnabled) {
      return;
    }
    this.audioSpritePlayer.stop();
  }
}
