'use strict';

import { Howl, Howler } from 'howler';

export { AudioOutput };

function AudioOutput(audioData) {
  return new Sound(audioData);
}

const STOP_ALL_SOUNDS_ID = 0;
const NO_SOUND = {
  urls: [''],
  sprite: {},
}

class Sound {

  constructor(audioData = NO_SOUND) {
    this.audioData = audioData.sprite;
    this.sound = new Howl({
      // TODO add bong sound
      src: audioData.urls,
      sprite: audioData.sprite,
      onplayerror: (error) => {
        console.log('SOUND PLAYER ERROR', error.message);
      },
      onloaderror: (error) => {
//        console.log('SOUND LOAD ERROR', error);
      },
      onload: () => {
        console.log('SOUND LOADED');
      },
    });
    this.activePlayId = [];
  }

  callback(message = {}) {
    switch (message.command) {
      case 'PLAYSAMPLE': {
        const id = message.id;
        const key = 'snd' + id;
        if (!this.audioData[key]) {
          return console.log('SAMPLE ID NOT FOUND', id);
        }
        console.log('PLAY SAMPLE ID', id);

        const isBackgroundMusic = (id > 1 && id < 23) || (id > 48 && id < 53);
        const slot = isBackgroundMusic ? 1 : 0;
        this.sound.stop(this.activePlayId[slot]);
        this.activePlayId[slot] = this.sound.play(key);
        console.log('this.activePlayId',slot,this.activePlayId[slot],isBackgroundMusic);
        break;
      }
      case 'MAINVOLUME':
        const volume = (message.value / 31);
        this.setVolume(volume);
        break;

      case 'STOPSOUND':
        this.sound.stop();
        break;

      case 'CHANNELOFF':
        console.log('CHANNELOFF_NOT_IMPLEMENTED YET', message.channel);
        break;

      default:
        console.log('NOT_IMPLEMENTED YET', message.command);
        break;

    }

  }

  playBootSound() {
    //TODO
  }

  setVolume(floatVolume) {
    console.log('SET MAINVOLUME', floatVolume);
    Howler.volume(floatVolume);
  }

  stop() {
    this.sound.pause();
  }

}
