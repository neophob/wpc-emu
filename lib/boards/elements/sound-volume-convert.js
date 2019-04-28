'use strict';

const debug = require('debug')('wpcemu:boards:elements:soundVolumeConvert');

module.exports = {
  getRelativeVolumeDcs,
  getRelativeVolumePreDcs,
};

/*
   function to convert 16 bit sound volume to an absolute volume (0..32)
   found values when set on screen volumes and dump commands, eg: "SET_GLOBAL_VOLUME_TO 47b8"

    FreeWPC implements this:

  	U8 code = current_volume * 8;
		sound_write_queue_insert (0x55);
		sound_write_queue_insert (0xAA);
		sound_write_queue_insert (code);
    sound_write_queue_insert (~code);

    see https://github.com/bcd/freewpc/blob/83161e2f62636cd5888af747a40d7727df1f13fa/kernel/sound.c
*/
function getRelativeVolumeDcs(volumeLo, volumeHi) {
  const complementaryVolume = (~volumeHi & 0xFF);
  if (volumeLo !== complementaryVolume) {
    debug('WARNING, INVALID VOLUME VALUE:', volumeLo, volumeHi);
    return;
  }

  return parseInt(volumeLo / 8, 10);
}

function getRelativeVolumePreDcs(volumeLo, volumeHi) {
  const complementaryVolume = (~volumeHi & 0xFF);
  if (volumeLo !== complementaryVolume) {
    debug('WARNING, INVALID VOLUME VALUE:', volumeLo, volumeHi);
    return;
  }

  return parseInt(volumeLo, 10);
}
