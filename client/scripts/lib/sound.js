'use strict';

export { AudioOutput };

function AudioOutput(AudioContext, sampleSize) {
  return new Sound(AudioContext, sampleSize);
}

const DEFAULT_SAMPLE_SIZE = 1024 * 5;
const INPUT_SAMPLE_RATE_HZ = 11000;

//If a speech signal is sampled at 22050 Hz, the highest frequency that we can expect to be present
//in the sampled signal is 11025 Hz. This means that to heed this expectation, we should run the
//continuous signal through a low-pass filter with a cut-off frequency below 11025 Hz; otherwise, we
//would experience the phenomenon of aliasing.

const CUTOFF_FREQUENCY_HZ = INPUT_SAMPLE_RATE_HZ / 2;

// check https://github.com/bfirsh/jsnes-web/blob/master/src/Speakers.js

class Sound {

  constructor(AudioContext) {
    this.audioCtx = new AudioContext();

    // TODO replace me with audio workers

    // create elements
    //this.audioSourceNode = this.audioCtx.createScriptProcessor(sampleSize, 1, 1);
    //this.audioSourceNode.onaudioprocess = this.onaudioprocess.bind(this);
    this.gainNode = this.audioCtx.createGain();
    this.lowpassFilter = this.audioCtx.createBiquadFilter();

    // configure nodes
    this.gainNode.gain.value = 0.9;
    this.lowpassFilter.type = 'lowpass';
    this.lowpassFilter.frequency.value = CUTOFF_FREQUENCY_HZ;
    // valid Q values: 0.0001 to 1000
    this.lowpassFilter.Q.value = 1;

    // connect nodes
    this.lowpassFilter.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.count = 0;
    this.buffer = this.audioCtx.createBuffer(1, DEFAULT_SAMPLE_SIZE, INPUT_SAMPLE_RATE_HZ);
    this.bufferData = this.buffer.getChannelData(0);
    this.audioBuffer = this.audioCtx.createBufferSource();
    this.audioBuffer.connect(this.lowpassFilter);
  }

  writeAudioData(value) {
    if (this.count < DEFAULT_SAMPLE_SIZE) {
      // fill buffer with values form -1.0 and 1.0
      this.bufferData[this.count++] = (value - 128) / 128;
      this.bufferData[this.count++] = 0;
      this.bufferData[this.count++] = 0;
      this.bufferData[this.count++] = 0;
    } else {
      // set the buffer in the AudioBufferSourceNode
      this.audioBuffer.buffer = this.buffer;
      // connect the AudioBufferSourceNode to the
      // destination so we can hear the sound

      // start the source playing
      this.audioBuffer.start();
      console.log('sound output');

      this.buffer = this.audioCtx.createBuffer(1, DEFAULT_SAMPLE_SIZE, INPUT_SAMPLE_RATE_HZ);
      this.bufferData = this.buffer.getChannelData(0);
      this.audioBuffer = this.audioCtx.createBufferSource();
      //TODO is this leaking?
      this.audioBuffer.connect(this.lowpassFilter);
      this.count = 0;
    }
  }

  setVolume(floatVolume) {
    this.gainNode.gain.value = floatVolume;
  }

  stop() {
    //audioSourceNode.disconnect()">
  }

}
