'use strict';

import { Howl, Howler } from 'howler';

export { AudioOutput };

function AudioOutput(sprite) {
  return new Sound(sprite);
}

const STOP_ALL_SOUNDS_ID = 0;

class Sound {

  constructor(sprite = []) {
    this.sprite = sprite;
    //TODO pass audio sample
    this.sound = new Howl({
      src: [
        // TODO add bong sound
        'sound/result.mp3',
      ],
      sprite,
      onplayerror: (error) => {
        console.log('SOUND PLAYER ERROR', error.message);
      },
      onloaderror: (error) => {
        console.log('SOUND LOAD ERROR', error.message);
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
        if (!this.sprite[key]) {
          return console.log('SOUND ENTRY NOT FOUND', id);
        }
        console.log('playbackId', id);
        this.activePlayId[0] = this.sound.play(key);
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
