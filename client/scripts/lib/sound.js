'use strict';

import RingBuffer from 'ringbufferjs';

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
    this.audioSourceNode.onaudioprocess = this.onaudioprocess.bind(this);
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0.7;

    this.audioSourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.bufferSize = 8192;
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
    this.buffer.enq(value);
    this.buffer.enq(value);
    this.buffer.enq(value);
  }

  setVolume(floatVolume) {
    this.gainNode.gain.value = floatVolume;
  }

  stop() {
    //audioSourceNode.disconnect()">
  }

}
