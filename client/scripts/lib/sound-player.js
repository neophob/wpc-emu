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

  playId(sampleData = {}) {
    if (!this.soundEnabled || !sampleData.sample) {
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
    this.audioSpritePlayer.resume();
  }

  stopAll() {
    if (!this.soundEnabled) {
      return;
    }
    this.audioSpritePlayer.stop();
  }
}
