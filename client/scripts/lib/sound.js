'use strict';

import RingBuffer from 'ringbufferjs';

export { AudioOutput };

function AudioOutput(AudioContext, sampleSize) {
  return new Sound(AudioContext, sampleSize);
}

const DEFAULT_SAMPLE_SIZE = 1024 * 4;
const INPUT_SAMPLE_RATE_HZ = 11000;

//If a speech signal is sampled at 22050 Hz, the highest frequency that we can expect to be present
//in the sampled signal is 11025 Hz. This means that to heed this expectation, we should run the
//continuous signal through a low-pass filter with a cut-off frequency below 11025 Hz; otherwise, we
//would experience the phenomenon of aliasing.

const CUTOFF_FREQUENCY_HZ = INPUT_SAMPLE_RATE_HZ / 2;

// check https://github.com/bfirsh/jsnes-web/blob/master/src/Speakers.js

class Sound {

  constructor(AudioContext, sampleSize = DEFAULT_SAMPLE_SIZE) {
    this.audioCtx = new AudioContext();

    // TODO replace me with audio workers

    // create elements
    this.audioSourceNode = this.audioCtx.createScriptProcessor(sampleSize, 1, 1);
    this.audioSourceNode.onaudioprocess = this.onaudioprocess.bind(this);
    this.gainNode = this.audioCtx.createGain();
    this.lowpassFilter = this.audioCtx.createBiquadFilter();

    // configure nodes
    this.gainNode.gain.value = 0.9;
    this.lowpassFilter.type = 'lowpass';
    this.lowpassFilter.frequency.value = CUTOFF_FREQUENCY_HZ;
    this.lowpassFilter.Q.value = 10;


    // connect nodes
    this.audioSourceNode.connect(this.lowpassFilter);
    this.lowpassFilter.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.bufferSize = DEFAULT_SAMPLE_SIZE * 2;
    this.buffer = new RingBuffer(this.bufferSize);
    console.log('sound init', this.buffer.size(), this.audioCtx.sampleRate);
  }

  onaudioprocess(event) {
    const output = event.outputBuffer.getChannelData(0);
    const size = output.length;

    try {
      const samples = this.buffer.deqN(size);

      for (var i = 0; i < size; i++) {
        output[i] = samples[i];
      }
    } catch (e) {
      // onBufferUnderrun failed to fill the buffer, so handle a real buffer
      // underrun

      // ignore empty buffers... assume audio has just stopped
      var bufferSize = this.buffer.size();
      if (bufferSize > 0) {
        //console.log(`Buffer underrun (needed ${size}, got ${bufferSize})`);
      }
      for (var j = 0; j < size; j++) {
        output[j] = 0;
      }
      return;
    }
  }

  writeAudioData(value) {
    if (this.buffer.size() >= this.bufferSize) {
      console.log('Buffer overrun');
    }
    //poor man resampling from 11khz to 44khz
    this.buffer.enq(value);
    this.buffer.enq(0);
    this.buffer.enq(0);
    this.buffer.enq(0);
  }

  setVolume(floatVolume) {
    this.gainNode.gain.value = floatVolume;
  }

  stop() {
    //audioSourceNode.disconnect()">
  }

}
