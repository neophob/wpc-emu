'use strict';
/*jshint bitwise: false*/

// TODO RENAME TO SOUNDBOARD + MOVE ONE LEVEL UP

const debug = require('debug')('wpcemu:boards:sound');
const CPU6809 = require('./up/cpu6809');
const YM2151 = require('./up/ym2151');
const soundMapper = require('../mapper/sound.js');

const YM2151_CLOCK_HZ = 3579545;
const YM2151_SAMPLERATE = 11000;

const MEMORY_SIZE = 0x2000;

module.exports = {
  getInstance,
};

function getInstance(romObject) {
  return new SoundBoard(romObject);
}

class SoundBoard {

  constructor(romObject) {
    this.ram = new Uint8Array(MEMORY_SIZE).fill(0);
    this.ym2151 = YM2151.create(YM2151_CLOCK_HZ, YM2151_SAMPLERATE, 1);
    this.u14 = romObject.u14;
    this.u15 = romObject.u15;
    this.u18 = romObject.u18;

    this.romBank = 0;

    this.tmpROM = this.u18.subarray(this.u18.length - 16 * 1024, this.u18.length);

    const readMemory = this.read8.bind(this);
    const writeMemory = this.write8.bind(this);
    CPU6809.init(writeMemory, readMemory);
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

  _hardwareWrite(offset, value) {
    switch (offset) {
      case soundMapper.ADDRESS_WPC_ROMBANK_W:
        debug('WRITE ADDRESS_WPC_ROMBANK_W', value);
        let bankBase = value & 0x0f;

        switch ((~value) & 0xe0) {
          case 0x80: /* U18 */
            bankBase |= 0x00;
            break;
          case 0x40: /* U15 */
            bankBase |= 0x10;
            break;
          case 0x20: /* U14 */
            bankBase |= 0x20;
            break;
          default:
            debug('INVALID_BANK_VALUE!');
        }
        debug('SELECT_SOUND_BANK', bankBase);
        this.romBank = value;
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
        debug('INVALID_HW_WRITE_0x', offset.toString(16), value);
        break;
    }
  }

  write8(offset, value) {
    if (isNaN(offset)) {
      throw new Error('SOUND_MEMORY_WRITE_BUG_DETECTED!');
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
        //debug('WRITE RAM', value, address.offset);
        this.ram[address.offset] = value;
        break;

      case soundMapper.SUBSYSTEM_HARDWARE:
        this._hardwareWrite(address.offset, value);
        break;

      default:
        throw new Error('SND_INVALID_WRITE_SUBSYSTEM_0x' + address.offset.toString(16));
    }
  }

  _hardwareRead(offset) {
    switch (offset) {
      case soundMapper.ADDRESS_YM2151_DATA:
        debug('READ ADDRESS_YM2151_DATA');
        return 0;

      case soundMapper.ADDRESS_WPC_LATCH_READ:
        debug('READ ADDRESS_WPC_LATCH_READ');
        break;

      default:
        debug('INVALID_HW_READ', '0x' + offset.toString(16));
        break;
    }
  }

  read8(offset) {
    if (isNaN(offset)) {
      throw new Error('SOUND_MEMORY_READ_BUG_DETECTED!');
    }

    const address = soundMapper.getAddress(offset);
    //debug('read from adr %o', { address, offset: offset.toString(16) });
    switch (address.subsystem) {

      case soundMapper.SUBSYSTEM_RAM:
        //debug('READ RAM', address.offset);
        return this.ram[address.offset];

      case soundMapper.SUBSYSTEM_HARDWARE:
        return this._hardwareRead(address.offset);

      case soundMapper.SUBSYSTEM_BANKSWITCHED:
        debug('READ BANKSWITCHED', address.offset.toString(16));
        //TODO reduce math
        return this.u18[ this.romBank * 32 * 1024 + address.offset ];

      case soundMapper.SUBSYSTEM_ROM:
        //debug('READ ROM', address.offset);
        return this.tmpROM[address.offset];

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
