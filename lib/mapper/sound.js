'use strict';

const MEMORY_ADDR_RAM = 0x2000;
const MEMORY_ADDR_HARDWARE = 0xC000;
const MEMORY_ADDR_ROM = 0x10000;

// 0x20000
const SUBSYSTEM_RAM = 'ram';
const SUBSYSTEM_HARDWARE = 'hardware';
const SUBSYSTEM_ROM = 'rom';

const ADDRESS_WPC_ROMBANK_W = 0x2000;
const ADDRESS_YM2151_REGISTER = 0x2400;
const ADDRESS_YM2151_DATA = 0x2401;
const ADDRESS_DAC_WRITE = 0x2800;
const ADDRESS_HC55516_CLOCK_SET_WRITE = 0x2C00;
const ADDRESS_HC55516_DIGIT_CLOCK_CLEAR_WRITE = 0x3400;
const ADDRESS_WPC_LATCH_READ = 0x3000;
const ADDRESS_WPC_VOLUME_WRITE = 0x3800;
const ADDRESS_WPC_LATCH_WRITE = 0x3C00;

module.exports = {
  getAddress,
  SUBSYSTEM_RAM,
  SUBSYSTEM_HARDWARE,
  SUBSYSTEM_ROM,
  ADDRESS_WPC_ROMBANK_W,
  ADDRESS_YM2151_REGISTER,
  ADDRESS_YM2151_DATA,
  ADDRESS_DAC_WRITE,
  ADDRESS_HC55516_CLOCK_SET_WRITE,
  ADDRESS_HC55516_DIGIT_CLOCK_CLEAR_WRITE,
  ADDRESS_WPC_LATCH_READ,
  ADDRESS_WPC_VOLUME_WRITE,
  ADDRESS_WPC_LATCH_WRITE,
};

function buildReturnModel(offset, subsystem) {
  return { offset, subsystem };
}

function getAddress(offset) {
  if (offset < 0) {
    throw new Error('SND_GET_ADDRESS_INVALID_MEMORY_REGION_0x' + offset.toString(16));
  }
  if (offset < MEMORY_ADDR_RAM) {
    return buildReturnModel(offset, SUBSYSTEM_RAM);
  }
  if (offset < MEMORY_ADDR_HARDWARE) {
    return buildReturnModel(offset, SUBSYSTEM_HARDWARE);
  }
  if (offset < MEMORY_ADDR_ROM) {
    return buildReturnModel(offset, SUBSYSTEM_ROM);
  }
  throw new Error('SND_GET_ADDRESS_INVALID_MEMORY_REGION_0x' + offset.toString(16));
}

/*

memcpy(memory_region(REGION_CPU1+locals.brdData.cpuNo) + 0x00c000, locals.brdData.romRegion + 0x07c000, 0x4000);


MACHINE_DRIVER_START(wmssnd_wpcs)
  MDRV_CPU_ADD(M6809, 2000000)
  MDRV_CPU_FLAGS(CPU_AUDIO_CPU)
  MDRV_CPU_MEMORY(wpcs_readmem, wpcs_writemem)
  MDRV_INTERLEAVE(50)
  MDRV_SOUND_ADD(YM2151, wpcs_ym2151Int)
  MDRV_SOUND_ADD(DAC,    wpcs_dacInt)
  MDRV_SOUND_ADD(HC55516,wpcs_hc55516Int)
  MDRV_SOUND_ADD(SAMPLES, samples_interface)
#ifdef PREDCS_FIRQ_HACK
  //Force the FIRQ to toggle @ the specified rate, but only while the 2151 is not outputting sound
  MDRV_TIMER_ADD(firq_hack, FIRQ_HACK_RATE)
#endif
MACHINE_DRIVER_END

static MEMORY_READ_START(wpcs_readmem)
  { 0x0000, 0x1fff, MRA_RAM },
  { 0x2401, 0x2401, YM2151_status_port_0_r }, // 2401-27ff odd
  { 0x3000, 0x3000, wpcs_latch_r }, // 3000-33ff
  { 0x4000, 0xbfff, CAT2(MRA_BANK, WPCS_BANK0) }, //32K
  { 0xc000, 0xffff, MRA_ROM }, // same as page 7f	//16K
MEMORY_END

static MEMORY_WRITE_START(wpcs_writemem)
  { 0x0000, 0x1fff, MWA_RAM },
  { 0x2000, 0x2000, wpcs_rombank_w }, / 2000-23ff /
  { 0x2400, 0x2400, YM2151_register_port_0_w }, / 2400-27fe even /
  { 0x2401, 0x2401, YM2151_data_port_0_w },     / 2401-27ff odd /
  { 0x2800, 0x2800, DAC_0_data_w }, /* 2800-2bff /
  { 0x2c00, 0x2c00, hc55516_0_clock_set_w },  /* 2c00-2fff /
  { 0x3400, 0x3400, hc55516_0_digit_clock_clear_w }, /* 3400-37ff /
  { 0x3800, 0x3800, wpcs_volume_w }, /* 3800-3bff /
  { 0x3c00, 0x3c00, wpcs_latch_w },  /* 3c00-3fff /
MEMORY_END
//NOTE: These volume levels sound really good compared to my own Funhouse and T2. (Dac=100%,CVSD=80%,2151=15%)
static struct DACinterface      wpcs_dacInt     = { 1, { 100 }};
static struct hc55516_interface wpcs_hc55516Int = { 1, { 100 }};
static struct YM2151interface   wpcs_ym2151Int  = {
  1, 3579545, /* Hz /
  { YM3012_VOL(15,MIXER_PAN_CENTER,15,MIXER_PAN_CENTER) },
  { wpcs_ym2151IRQ }
};








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


#define WPCS_ROMLOAD8(start, n, chk) \
  ROM_LOAD(n, start, 0x80000, chk)


#define WPCS_ROMLOAD2(start, n, chk) \
  ROM_LOAD(n, start,  0x20000, chk) \
    ROM_RELOAD( start + 0x20000, 0x20000) \
    ROM_RELOAD( start + 0x40000, 0x20000) \
    ROM_RELOAD( start + 0x60000, 0x20000)

#define ROM_RELOAD(offset,length)					ROMX_LOAD(ROMENTRY_RELOAD, offset, length, 0, ROM_INHERITFLAGS)

*/
