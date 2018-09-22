source: http://www.luxatom.com/VgmPlayer/

# Snippets from `vgm.js`

```
self.outputSampleRate = 44100;
settings = {
    ym2151: {
        clock: 0,
        type: window.FM && useDropIn ? 1 : 0
    },

if (settings.ym2151.type && settings.ym2151.clock > 0) {
  chips['ym2151'][0].Init(settings.ym2151.clock, self.outputSampleRate);
  chips['ym2151'][0].mixStereo(audioBuffer, sample_count, z);

var samples_remaining = 0;
this.fillSamples = function(audioBuffer, channelCount) {
    if (!isPlaying) {
        return audioBuffer;
    }
    var offset = 0,
        n, z;
    var buffer_remaining = ((audioBuffer.length - offset) / channelCount) | 0,
        sample_count;

    while (buffer_remaining > 0) {
        sample_count = (samples_remaining + 0.5) | 0;
        if (buffer_remaining < sample_count) sample_count = buffer_remaining;
        z = offset;
        if (sample_count > 0) {
          chips['ym2151'][0].mixStereo(audioBuffer, sample_count, z);

          samples_remaining -= sample_count;
          buffer_remaining -= sample_count;
          offset += (channelCount * sample_count);
          pos += sample_count;
      }
      if (samples_remaining > 0) {
          break;
      }
      if (!isPlaying) {
          samples_remaining = 0;
          break;
      } else {
          samples_remaining += (nextCommand() * self.playbackFactor);
      }
  }
  return audioBuffer;
}

```
