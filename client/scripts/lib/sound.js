'use strict';

import { Howl } from 'howler';

export { AudioOutput };

function AudioOutput() {
  return new Sound();
}

const MAXIMAL_SAMPLE_ID	= 0xFFF;

class Sound {

  constructor() {
    //TODO pass audio sample
/*    this.sound = new Howl({
      src: ['']
    });*/
  }

  playbackId(value) {
    console.log('playbackId', value);
  }

  setVolume(floatVolume) {
    if (this.noAudio) {
      return;
    }
    // TODO set volume
  }

  stop() {
    //audioSourceNode.disconnect()">
  }

}
