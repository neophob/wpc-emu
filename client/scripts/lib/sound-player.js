'use strict';

export { SoundPlayer };

const CATEGORY_BACKGROUND = 'background';
const CATEGORY_SINGLE = 'single';
const CATEGORY_JINGLE = 'jingle';
const CATEGORY_SOUNDFX = 'soundfx';
const CATEGORY_VOICE = 'voice';

function SoundPlayer(audioSpritePlayer, category) {
  console.log('AA');
  return new SoundCategory(audioSpritePlayer, category);
}

class SoundCategory {

  constructor(audioSpritePlayer, category) {
    this.audioSpritePlayer = audioSpritePlayer;
    this.category = category;
    this.activePlayId = [];

    console.log('category',category);
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
    console.log('playId', {id, key});
    console.log('category', this._getCategory(id));
    this.audioSpritePlayer.play(key);
  }

  pause() {
    console.log('pause');
    this.audioSpritePlayer.pause();
  }

  stopAll() {
    console.log('stopAll')
    this.audioSpritePlayer.stop();
  }
}
