'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:sound');
const YM2151 = require('./up/ym2151');

module.exports = {
  getInstance
};

function getInstance() {
  return new SoundBoard();
}

class SoundBoard {

  constructor() {
    const SAMPLERATE = 11000;
    const CLOCK_HZ = 3579545;
    this.ym2151 = YM2151.create(CLOCK_HZ, SAMPLERATE, 1);

    //TODO instatiate new CPU 6809 ??

    /*
    TODO LOAD sound roms

    static struct YM2151interface   s11cs_ym2151Int  = {
      1, 3579545, // Hz
      { YM3012_VOL(10,MIXER_PAN_CENTER,30,MIXER_PAN_CENTER) },
      { s11cs_ym2151IRQ }
    };

    MACHINE_DRIVER_START(wmssnd_s11cs)
      MDRV_CPU_ADD(M6809, 2000000)
      MDRV_CPU_FLAGS(CPU_AUDIO_CPU)
      MDRV_CPU_MEMORY(s11cs_readmem, s11cs_writemem)
      MDRV_INTERLEAVE(50)
      MDRV_SOUND_ADD(YM2151, s11cs_ym2151Int)
      MDRV_SOUND_ADD_TAG("dac",  DAC,    s11cs_dacInt)
      MDRV_SOUND_ADD_TAG("cvsd", HC55516,s11cs_hc55516Int)
      MDRV_SOUND_ADD(SAMPLES, samples_interface)
    MACHINE_DRIVER_END

    static MEMORY_READ_START(s11cs_readmem)
      { 0x0000, 0x1fff, MRA_RAM },
      { 0x2001, 0x2001, YM2151_status_port_0_r }, // 2001-2fff odd
      { 0x4000, 0x4003, pia_r(S11CS_PIA0) },      // 4000-4fff
      { 0x8000, 0xffff, MRA_BANKNO(S11CS_BANK0) },
    MEMORY_END

    static MEMORY_WRITE_START(s11cs_writemem)
      { 0x0000, 0x1fff, MWA_RAM },
      { 0x2000, 0x2000, YM2151_register_port_0_w },     / 2000-2ffe even /
      { 0x2001, 0x2001, YM2151_data_port_0_w },         / 2001-2fff odd /
      { 0x4000, 0x4003, pia_w(S11CS_PIA0) },            / 4000-4fff /
      { 0x6000, 0x6000, hc55516_0_digit_clock_clear_w },/ 6000-67ff /
      { 0x6800, 0x6800, hc55516_0_clock_set_w },        / 6800-6fff /
      { 0x7800, 0x7800, s11cs_rombank_w },              / 7800-7fff /
      { 0x9c00, 0x9cff, odd_w },
    MEMORY_END

#define SOUNDREGION(size ,reg)   ROM_REGION(size, reg, ROMREGION_SOUNDONLY)

#define ROM_RELOAD(offset,length)					ROMX_LOAD(ROMENTRY_RELOAD, offset, length, 0, ROM_INHERITFLAGS)

#define WPCS_STDREG \
  SOUNDREGION(0x010000, WPCS_CPUREGION) \
  SOUNDREGION(0x180000, WPCS_ROMREGION)

#define WPCS_ROMLOAD2(start, n, chk) \
  ROM_LOAD(n, start,  0x20000, chk) \
  ROM_RELOAD( start + 0x20000, 0x20000) \
  ROM_RELOAD( start + 0x40000, 0x20000) \
  ROM_RELOAD( start + 0x60000, 0x20000)

WPCS_STDREG \
WPCS_ROMLOAD2(0x000000, u18, chk18) \
WPCS_ROMLOAD2(0x080000, u15, chk15) \
WPCS_ROMLOAD2(0x100000, u14, chk14)
    */
  }

  start() {
    debug('start');
    this.resetChip();
  }

  writeControlStatus() {

  }

  writeSoundData(data) {
    debug('WRITE_DATA', data);
  }

  readSoundData() {
    debug('READ_DATA');
  }

  resetChip() {
    this.ym2151.Reset();
  }

  getUiState() {
  }

}
