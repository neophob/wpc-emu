'use strict';

export { AudioOutput };

function AudioOutput(AudioContext, sampleSize) {
  return new Sound(AudioContext, sampleSize);
}

const DEFAULT_SAMPLE_SIZE = 1024 * 1;
const INPUT_SAMPLE_RATE_HZ = 11000;
const MONO = 1;

class Sound {

  constructor(AudioContext) {
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();

    // configure nodes
    this.gainNode.gain.value = 0.9;

    // connect nodes
    this.gainNode.connect(this.audioCtx.destination);

    this._prepareAudio();

    setInterval(() => {
      this._fillAudioBuffer();
    }, 50);
  }

  _prepareAudio() {
    this.ym2151buffer = this.audioCtx.createBuffer(2, DEFAULT_SAMPLE_SIZE, 44100);

    this.buffer = this.audioCtx.createBuffer(MONO, DEFAULT_SAMPLE_SIZE, INPUT_SAMPLE_RATE_HZ);
    this.bufferData = this.buffer.getChannelData(0);
    this.audioBuffer = this.audioCtx.createBufferSource();
    this.audioBuffer.playbackRate.value = 0.2494331066;
    //TODO is this leaking?
    this.audioBuffer.connect(this.gainNode);
    this.count = 0;
  }

  writeAudioData(value) {
    if (this.count < DEFAULT_SAMPLE_SIZE) {
      // fill buffer with values form -1.0 and 1.0
      this.bufferData[this.count++] = (value - 128) / 128;
    } else {
      // set the buffer in the AudioBufferSourceNode
      this.audioBuffer.buffer = this.buffer;
//      console.log('sound output', this.audioBuffer.buffer.duration);

      // start the source playing
      this.audioBuffer.start();
      //TODO need to do a clever buffer switch here
      this._prepareAudio();
    }
  }

  setVolume(floatVolume) {
    this.gainNode.gain.value = floatVolume;
  }

  _fillAudioBuffer() {
//    this.mixStereoFunction(this.ym2151buffer, this.ym2151buffer.length, 0);
//    console.log('bufr',this.ym2151buffer);
  }

  setMixStereoFunction(mixStereoFunction) {
    this.mixStereoFunction = mixStereoFunction;
//    console.log('XXXmixStereoFunction', this.mixStereoFunction);
  }

  stop() {
    //audioSourceNode.disconnect()">
  }

}
