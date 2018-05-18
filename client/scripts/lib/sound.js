'use strict';

export { AudioOutput };

function AudioOutput(AudioContext, sampleSize) {
  return new Sound(AudioContext, sampleSize);
}

const DEFAULT_SAMPLE_SIZE = 1024;

// check https://github.com/bfirsh/jsnes-web/blob/master/src/Speakers.js

class Sound {

  constructor(AudioContext, sampleSize = DEFAULT_SAMPLE_SIZE) {
    this.audioCtx = new AudioContext();

    // TODO replace me with audio workers
    this.audioSourceNode = this.audioCtx.createScriptProcessor(sampleSize, 1, 1);
    this.audioSourceNode.onaudioprocess = this.onaudioprocess;
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0.05;

    this.audioSourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    console.log('sound init', this.audioCtx.destination);
  }

  onaudioprocess(event) {
    const output = event.outputBuffer.getChannelData(0);
    for (var i = 0; i < output.length; i++) {
      output[i] = Math.random() / 2;
    }
  }

  writeAudioData() {
    //TODO     this.buffer.enq(left);
  }

  setVolume(floatVolume) {
    this.gainNode.gain.value = floatVolume;
  }

  stop() {
    //audioSourceNode.disconnect()">
  }

}
