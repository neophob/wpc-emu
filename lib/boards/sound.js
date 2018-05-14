'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:sound');
const CPU6809 = require('./up/cpu6809');
const YM2151 = require('./up/ym2151');
const soundMapper = require('../mapper/sound.js');

const YM2151_CLOCK_HZ = 3579545;
const YM2151_SAMPLERATE = 11000;

const MEMORY = 0x2000;

module.exports = {
  getInstance,
};

function getInstance(romObject) {
  return new SoundBoard(romObject);
}

class SoundBoard {

  constructor(romObject) {
    this.ram = new Uint8Array(MEMORY).fill(0);
    this.ym2151 = YM2151.create(YM2151_CLOCK_HZ, YM2151_SAMPLERATE, 1);
    this.u14 = romObject.u14;
    this.u15 = romObject.u15;
    this.u18 = romObject.u18;

    CPU6809.init(this.write8, this.read8);
  }

  executeCycle(ticksToRun = 500, tickSteps = 4) {
    let ticksExecuted = 0;
    while (ticksExecuted < ticksToRun) {
      const singleTicks = CPU6809.steps(tickSteps);
      ticksExecuted += singleTicks;
/*      this.ticksIrq += singleTicks;
      if (this.ticksIrq >= timing.CALL_IRQ_AFTER_TICKS) {
        this.ticksIrq -= timing.CALL_IRQ_AFTER_TICKS;
        // TODO isPeriodicIrqEnabled is from freeWpc, unknown if the "real" WPC system implements this too
        // some games needs a manual irq trigger if this is implemented (like indiana jones)
        //if (this.asic.isPeriodicIrqEnabled()) {
        CPU6809.irq();
        //}
      }*/
    }
    return ticksExecuted;
  }

  write8(offset, value) {
    if (isNaN(offset)) {
      debug('MEMORY WRITE OFFSET BUG DETECTED!');
      return;
    }
    if (value === undefined) {
      debug('MEMORY WRITE VALUE BUG DETECTED!');
      return;
    }

    value &= 0xFF;
    const address = soundMapper.getAddress(offset);
    //debug('write to adr %o', { address, offset: offset.toString(16), value });
    switch (address.subsystem) {

      case soundMapper.SUBSYSTEM_RAM:
        debug('WRITE RAM', value, address.offset);
        this.ram[address.offset] = value;
        break;

      case soundMapper.SUBSYSTEM_HARDWARE:

        switch (address.subsystem) {
          case soundMapper.ADDRESS_YM2151_DATA:
            debug('WRITE ADDRESS_YM2151_DATA', value, address.offset);
            break;

          case soundMapper.ADDRESS_WPC_LATCH_READ:
            debug('WRITE ADDRESS_WPC_LATCH_READ', value, address.offset);
            break;

          default:
            debug('INVALID_HW_WRITE', value, address.offset);
            break;
        }
        break;

      default:
        throw new Error('SND_INVALID_WRITE_SUBSYSTEM_0x' + address.offset.toString(16));
    }
  }

  _hardwareWrite(offset, value) {
    switch (offset) {
      case soundMapper.ADDRESS_WPC_ROMBANK_W:
        debug('WRITE ADDRESS_WPC_ROMBANK_W', value);
        break;

      case soundMapper.ADDRESS_YM2151_REGISTER:
        debug('WRITE ADDRESS_YM2151_REGISTER', value);
        break;

      case soundMapper.ADDRESS_YM2151_DATA:
        debug('WRITE ADDRESS_YM2151_REGISTER', value);
        break;

      case soundMapper.ADDRESS_DAC_WRITE:
        debug('WRITE ADDRESS_DAC_WRITE', value);
        break;

      case soundMapper.ADDRESS_HC55516_CLOCK_SET_WRITE:
        debug('WRITE ADDRESS_HC55516_CLOCK_SET_WRITE', value);
        break;

      case soundMapper.ADDRESS_HC55516_DIGIT_CLOCK_CLEAR_WRITE:
        debug('WRITE ADDRESS_HC55516_DIGIT_CLOCK_CLEAR_WRITE', value);
        break;

      case soundMapper.ADDRESS_WPC_VOLUME_WRITE:
        debug('WRITE ADDRESS_WPC_VOLUME_WRITE', value);
        break;

      case soundMapper.ADDRESS_WPC_LATCH_WRITE:
        debug('WRITE ADDRESS_WPC_LATCH_WRITE', value);
        break;

      default:
        debug('INVALID_HW_READ', offset, value);
        break;
    }
  }

/*
  { 0x2000, 0x2000, wpcs_rombank_w }, / 2000-23ff /
  { 0x2400, 0x2400, YM2151_register_port_0_w }, / 2400-27fe even /
  { 0x2401, 0x2401, YM2151_data_port_0_w },     / 2401-27ff odd /
  { 0x2800, 0x2800, DAC_0_data_w }, /* 2800-2bff /
  { 0x2c00, 0x2c00, hc55516_0_clock_set_w },  /* 2c00-2fff /
  { 0x3400, 0x3400, hc55516_0_digit_clock_clear_w }, /* 3400-37ff /
  { 0x3800, 0x3800, wpcs_volume_w }, /* 3800-3bff /
  { 0x3c00, 0x3c00, wpcs_latch_w },  /* 3c00-3fff /

  ,
  ADDRESS_HC55516_CLOCK_SET_WRITE,
  ADDRESS_HC55516_DIGIT_CLOCK_CLEAR_WRITE,
  ADDRESS_WPC_LATCH_READ,
  ADDRESS_WPC_VOLUME_WRITE,
  ADDRESS_WPC_LATCH_WRITE,
  */


  _hardwareRead(offset) {
    switch (offset) {
      case soundMapper.ADDRESS_YM2151_DATA:
        debug('READ ADDRESS_YM2151_DATA', offset);
        return 0;

      case soundMapper.ADDRESS_WPC_LATCH_READ:
        debug('READ ADDRESS_WPC_LATCH_READ', offset);
        break;

      default:
        debug('INVALID_HW_READ', offset);
        break;
    }
  }

  read8(offset) {
    if (isNaN(offset)) {
      debug('MEMORY READ BUG DETECTED!');
      return;
    }
    const address = soundMapper.getAddress(offset);
    //debug('read from adr %o', { address, offset: offset.toString(16) });
    switch (address.subsystem) {

      case soundMapper.SUBSYSTEM_RAM:
        debug('READ RAM', address.offset);
        return this.ram[address.offset];

      case soundMapper.SUBSYSTEM_HARDWARE:
        return this._hardwareRead(address.offset);

      case soundMapper.SUBSYSTEM_ROM:
        debug('READ ROM', address.offset);
        return this._hardwareRead(address.offset);

      default:
        throw new Error('SND_INVALID_READ_SUBSYSTEM');
    }
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
    return 0;
  }

  resetChip() {
    this.ym2151.Reset();
    CPU6809.reset();
  }

}
