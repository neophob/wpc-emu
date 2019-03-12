'use strict';

import { Howl } from 'howler';

export { SoundPlayer };

const CATEGORY_BACKGROUND = 'background';
const CATEGORY_SINGLE = 'single';
const CATEGORY_JINGLE = 'jingle';
const CATEGORY_SOUNDFX = 'soundfx';
const CATEGORY_VOICE = 'voice';

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

  _getCategory(id) {
    if (this.category[CATEGORY_BACKGROUND].includes(id)) {
      return 1;
    }
    if (this.category[CATEGORY_SINGLE].includes(id)) {
      return 2;
    }
    if (this.category[CATEGORY_JINGLE].includes(id)) {
      return 3;
    }
    if (this.category[CATEGORY_SOUNDFX].includes(id)) {
      return 4;
    }
    if (this.category[CATEGORY_VOICE].includes(id)) {
      return 5;
    }
  }

  playId(id, key) {
    if (!this.soundEnabled) {
      return;
    }

    const category = this._getCategory(id);
    console.log('playId', {id, key});
    console.log('category', category, this.activePlayId[category]);
    if (this.activePlayId[category] !== undefined) {
      console.log('stop previous song', );
      this.audioSpritePlayer.stop(this.activePlayId[category]);
    }
    this.activePlayId[category] = this.audioSpritePlayer.play(key);
  }

  pause() {
    if (!this.soundEnabled) {
      return;
    }
    console.log('pause');
    this.audioSpritePlayer.pause();
  }

  stopAll() {
    if (!this.soundEnabled) {
      return;
    }
    console.log('stopAll')
    this.audioSpritePlayer.stop();
  }
}
