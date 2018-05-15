'use strict';
/*jshint bitwise: false*/

// TODO RENAME TO SOUNDBOARD + MOVE ONE LEVEL UP

const debug = require('debug')('wpcemu:boards:sound');
const CPU6809 = require('./up/cpu6809');
const YM2151 = require('./up/ym2151');
const soundMapper = require('../mapper/sound.js');

const YM2151_CLOCK_HZ = 3579545;
const YM2151_SAMPLERATE = 11000;

const ROM_BANK_SIZE = 0x8000;
const SYSTEM_ROM_SIZE = 0x4000;
const MEMORY_SIZE = 0x2000;

// source: http://www.cx5m.net/fmunit.htm
const YM2151_REGISTER = [];
YM2151_REGISTER[0x01] = 'TEST & LFO RESET';
YM2151_REGISTER[0x08] = 'KEY ON';
YM2151_REGISTER[0x0F] = 'NOISE ENABLE, NOISE FREQUENCY';
YM2151_REGISTER[0x11] = 'CLOCK A1';
YM2151_REGISTER[0x12] = 'CLOCK A2';
YM2151_REGISTER[0x13] = 'CLOCK B';
YM2151_REGISTER[0x14] = 'CLOCK FUNCTIONS';
YM2151_REGISTER[0x18] = 'LOW FREQUENCY';
YM2151_REGISTER[0x19] = 'PHASE AND AMPLITUDE MODULATION';
YM2151_REGISTER[0x1B] = 'CONTROL OUTPUT & WAVE FORM SELECT';
YM2151_REGISTER[0x20] = 'CHANNEL CONTROL';

// should be called 2400 times per second
// each 0.42ms, 0.42ms * 2000 ticks per ms = 833
const CALL_YM2151_FIRQ_HACK_AFTER_TICKS = 833;

/*REGISTER #28-2F (KEY CODE)
REGISTER #30-37 (KEY FRACTION)
REGISTER #38-3F (PHASE & AMPLITUDE MODULATION SENSITIVITY)
REGISTER #40-5F (DETUNE & PHASE MULTIPLY)
REGISTER #60-7F (TOTAL LEVEL)
REGISTER #80-9F (EG ATTACK)
REGISTER #A0-BF (EG DECAY 1)
REGISTER #C0-DF (EG DECAY 2)
REGISTER #E0-FF (EG DECAY LEVEL, RELEASE RATE)*/



module.exports = {
  getInstance,
};

function getInstance(romObject) {
  return new SoundBoard(romObject);
}

class SoundBoard {

  constructor(romObject) {
    this.ram = new Uint8Array(MEMORY_SIZE).fill(0);
    this.ym2151 = YM2151.create(YM2151_CLOCK_HZ, YM2151_SAMPLERATE);
    console.log('this.ym2151',this.ym2151);
    console.log('this.ym2151 ch',this.ym2151.ch);
    //TODO build huge virtual rom out of u14, u15 and u18
    /*
    0x000000 u18
    0x080000 u15
    0x100000 u14
    */
    this.u14 = romObject.u14;
    this.u15 = romObject.u15;
    this.u18 = romObject.u18;

    this.volume = 0;
    this.ym2151Register0 = 0;
    this.firqHackTicks = 0;

    this.romBankOffset = 0;
    this.tmpROM = this.u18.subarray(this.u18.length - SYSTEM_ROM_SIZE, this.u18.length);

    const readMemory = this.read8.bind(this);
    const writeMemory = this.write8.bind(this);
    CPU6809.init(writeMemory, readMemory);
  }

  executeCycle(ticksToRun = 500, tickSteps = 4) {
    let ticksExecuted = 0;
    while (ticksExecuted < ticksToRun) {
      const singleTicks = CPU6809.steps(tickSteps);
      ticksExecuted += singleTicks;
      this.firqHackTicks += singleTicks;
      if (this.firqHackTicks >= CALL_YM2151_FIRQ_HACK_AFTER_TICKS) {
        this.firqHackTicks -= CALL_YM2151_FIRQ_HACK_AFTER_TICKS;
        CPU6809.firq();
      }

    }
    return ticksExecuted;
  }

  _getBankRomOffset(value) {
    const bankBase = value & 0x0f;
    switch ((~value) & 0xe0) {
      case 0x80: /* U18 */
        return bankBase | 0x00;
      case 0x40: /* U15 */
        return bankBase | 0x10;
      case 0x20: /* U14 */
        return bankBase | 0x20;
      default:
        debug('INVALID_BANK_VALUE!');
        return 0;
    }
  }

  _hardwareWrite(offset, value) {
    switch (offset) {
      case soundMapper.ADDRESS_WPC_ROMBANK_W:
        this.romBankOffset = this._getBankRomOffset(value) << 15;
        debug('WRITE ADDRESS_WPC_ROMBANK_W', value, this.romBankOffset);
        break;

      case soundMapper.ADDRESS_YM2151_REGISTER:
        this.ym2151Register0 = value;
        debug('W SELECT_YM2151_REGISTER', value, YM2151_REGISTER[value]);
        break;

      case soundMapper.ADDRESS_YM2151_DATA:
        this.ym2151.SetReg(this.ym2151Register0, value);
        debug('WRITE ADDRESS_YM2151_DATA', this.ym2151Register0, value);
        break;

      case soundMapper.ADDRESS_DAC_WRITE:
        //debug('WRITE ADDRESS_DAC_WRITE', value);
        break;

      case soundMapper.ADDRESS_HC55516_CLOCK_SET_WRITE:
        debug('WRITE ADDRESS_HC55516_CLOCK_SET_WRITE', value);
        break;

      case soundMapper.ADDRESS_HC55516_DIGIT_CLOCK_CLEAR_WRITE:
        debug('WRITE ADDRESS_HC55516_DIGIT_CLOCK_CLEAR_WRITE', value);
        break;

      case soundMapper.ADDRESS_WPC_VOLUME_WRITE:
        //this.ym2151.SetVolume();
        if (value & 0x01) {
          if ((this.volume > 0) && (value & 0x02)) {
            this.volume -= 1;
          }
          else if ((this.volume < 0xFF) && ((value & 0x02) === 0)) {
            this.volume += 1;
          }

/*          {
            int ch;
            for (ch = 0; ch < MIXER_MAX_CHANNELS; ch++) {
              if (mixer_get_name(ch) != NULL)
                mixer_set_volume(ch, locals.volume * 100 / 127);
            }
          }*/
        }
        debug('WRITE ADDRESS_WPC_VOLUME_WRITE %o', { value, volume: this.volume });
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
        debug('READ ADDRESS_YM2151_DATA', this.ym2151.status);
        // bit 0: timer a, bit 1: timer b, bit 7 busy
        // after writing to the register, the cpu is busy for some time - a read must return 0 before
        // next write can happen
        return this.ym2151.status;

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
        //TODO support banked read
        return this.u18[ this.romBankOffset + address.offset ];

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
