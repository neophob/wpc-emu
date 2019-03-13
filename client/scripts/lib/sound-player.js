'use strict';

import { Howl } from 'howler';

export { SoundPlayer };

function SoundPlayer(audioData) {
  return new SoundCategory(audioData);
}

class SoundCategory {

  constructor(audioData) {
    this.category = audioData.category;
    this.activePlayId = [];
    this.soundEnabled = false;

    if (audioData.urls.length === 0) {
      console.log('NO_SOUND_DATA');
      return;
    }

    this.soundLoaded = new Promise((resolve, reject) => {
      this.audioSpritePlayer = new Howl({
        src: audioData.urls,
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

  playId(id, key) {
    if (!this.soundEnabled) {
      return;
    }
    this.audioSpritePlayer.play(key);
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
