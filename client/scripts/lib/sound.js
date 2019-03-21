'use strict';

import { Howl, Howler } from 'howler';
import { createSoundPlayer } from './sound-player';

export { AudioOutput };

function AudioOutput(audioData) {
  return new Sound(audioData);
}

const BONG_SOUND = [ FETCHURL + 'sound/boing.mp3' ];
const NO_SOUND = {
  url: [],
  sample: {},
  sprite: {},
};

class Sound {

  constructor(audioData = NO_SOUND) {
    this.sample = audioData.sample;

    this.bong = new Howl({
      volume: 1.0,
      src: BONG_SOUND,
    });

    this.player = createSoundPlayer(audioData);
  }

  callback(message = {}) {
    switch (message.command) {
      case 'PLAYSAMPLE': {
        const id = message.id;
        if (!this.sample[id]) {
          return console.log('SAMPLE ID NOT FOUND', id);
        }
        this.player.playId(this.sample[id]);
        break;
      }
      case 'MAINVOLUME':
        const volume = (message.value / 31);
        this.setVolume(volume);
        break;

      case 'STOPSOUND':
        this.player.stopAll();
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
    console.log('playbootsound');
    this.bong.play();
  }

  setVolume(floatVolume) {
    console.log('SET MAINVOLUME', floatVolume);
    Howler.volume(floatVolume);
  }

  stop() {
    this.player.stopAll();
  }

  pause() {
    this.player.pause();
  }

  resume() {
    this.player.resume();
  }

  getState() {
    return this.player.soundState;
  }
}
