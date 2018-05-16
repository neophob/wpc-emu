'use strict';

export { AudioOutput };

function AudioOutput(AudioContext, sampleSize) {
  return new Sound(AudioContext, sampleSize);
}

const DEFAULT_SAMPLE_SIZE = 1024;

class Sound {

  constructor(AudioContext, sampleSize = DEFAULT_SAMPLE_SIZE) {
    this.audioCtx = new AudioContext();

    // TODO replace me with audio workers
    this.audioSourceNode = this.audioCtx.createScriptProcessor(sampleSize, 1, 1);
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0.5;

    this.audioSourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    console.log('sound init', this.audioCtx.destination);
  }

  registerAudioSource(soundProducerFunction) {
    console.log('registerAudioSource', soundProducerFunction);
    this.audioSourceNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      soundProducerFunction(output);
    };
  }

  setVolume(floatVolume) {
    this.gainNode.gain.value = floatVolume;
  }

  stop() {
    //audioSourceNode.disconnect()">
  }

}
