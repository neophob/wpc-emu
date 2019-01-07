'use strict';

// Williams part numbers A-14039
// the soundboard runs its own 6809 cpu

const debug = require('debug')('wpcemu:boards:sound-board');
const Cpu6809 = require('./up/cpu6809');

const YM2151 = require('./up/ym2151');
const soundMapper = require('./mapper/sound.js');
const ym2151Mapper = require('./mapper/ym2151.js');

const OP = {
  WPC_ROMBANK_W: 0x2000,
  WPC_DAC_WRITE: 0x2800,
  HC55516_CLOCK_SET_WRITE: 0x2C00,
  WPC_LATCH_READ: 0x3000,
  HC55516_DIGIT_CLOCK_CLEAR_WRITE: 0x3400,
  WPC_VOLUME_WRITE: 0x3800,
  WPC_LATCH_WRITE: 0x3C00,

  WPC_SOUND_CONTROL_STATUS: 0x3FDD,
  WPC_SOUND_DATA: 0x3FDC,
};
const REVERSEOP = [];
Object.keys(OP).forEach((key) => {
  REVERSEOP[OP[key]] = key;
});

const YM2151_CLOCK_HZ = 3579545;
//TODO expose this sample rate for the client OR INJECT desired samplerate!
const YM2151_SAMPLERATE = 44100;//11000;

//const YM2151_TICK_MULTIPLIER = YM2151_CLOCK_HZ / CPU6809_CLOCK_HZ;
// If no data is ready, returns 0xFF.
const NO_SOUND_DATA_READY = 0xFF;

/*
  sound data 0x79: soundboard ready?

  when changing sound track in test menu
    write sound data 125 (0x7d)
    write sound data 127 (0x7f)
    write sound data 126 (0x7e)
    write sound data 125 (0x7d)
    write sound data 127 (0x7f)

  when booting a rom, those commands are sent
    write sound data 0
    write sound data 121
    write sound data 12
    write sound data 243
    write sound data 84
    write sound data 84
    write sound data 84
    write sound data 84
    write sound data 84

TODO what should i do with this.soundData???
*/

const MEMORY_SIZE = 0x2000;

// TODO if used, move to timing
// should be called 2400 times per second
// each 0.42ms, 0.42ms * 2000 ticks per ms = 833
//const CALL_YM2151_FIRQ_HACK_AFTER_TICKS = 833;

module.exports = {
  getInstance,
};

function getInstance(romObject) {
  return new SoundBoard(romObject);
}

class SoundBoard {

  constructor(initObject) {
    this.interruptCallback = initObject.interruptCallback;
    this.ram = new Uint8Array(MEMORY_SIZE).fill(0);
    this.volume = 0;
    this.ym2151Register0 = 0;
    this.soundData = NO_SOUND_DATA_READY;
    this.firqHackTicks = 0;
    this.romBankOffset = 0;

    const readMemory = this._cpuRead8.bind(this);
    const writeMemory = this._cpuWrite8.bind(this);
    this.cpu = Cpu6809.getInstance(writeMemory, readMemory, 'soundboard');

    this.ym2151 = YM2151.create(YM2151_CLOCK_HZ, YM2151_SAMPLERATE);
    //this.ym2151.SetTimerBase(); ??
    this.ym2151.TimerA = () => {
      //TODO what should be done here?
      //console.log('TIMER A STRIKE');
    };
    this.ym2151.Intr = (booleanSetIrq) => {
      if (booleanSetIrq === true) {
        this.cpu.firq();
      } else {
        this.cpu.clearFirqMasking();
      }
    };

    this.dacCallback = () => {};
    this.systemROM = initObject.romObject.soundSystemRom;
    this.concatenatedSoundRom = initObject.romObject.concatenatedSoundRom;
    if (!this.systemROM || !this.concatenatedSoundRom) {
      debug('NO_SOUND_ROM_AVAILABLE');
      this.noRomAvailable = true;
    } else {
      this.noRomAvailable = false;
    }
  }

  reset() {
    if (this.noRomAvailable) {
      return;
    }
    console.log('RESET_SOUNDBOARD');
    this.volume = 0;
    this.ym2151Register0 = 0;
    this.soundData = NO_SOUND_DATA_READY;
    this.firqHackTicks = 0;
    this.romBankOffset = 0;
    this.ym2151.Reset();
    this.cpu.reset();
  }

  getUiState() {
    const cpuStatus = this.cpu.status();
    const state = {
      ram: this.ram,
      volume: this.volume,
      ticks: this.cpu.tickCount,
      missedIrqCall: cpuStatus.missedIRQ,
      missedFirqCall: cpuStatus.missedFIRQ,
      irqCount: cpuStatus.irqCount,
      firqCount: cpuStatus.firqCount,
      nmiCount: cpuStatus.nmiCount,
    };
    return state;
  }

  executeCycle(ticksToRun = 500, tickSteps = 4) {
    if (this.noRomAvailable) {
      return;
    }
    let ticksExecuted = 0;

    while (ticksExecuted < ticksToRun) {
      const singleTicks = this.cpu.steps(tickSteps);

      //TODO unclear what ticks we need here
      //this.ym2151.Count(singleTicks/1);
      ticksExecuted += singleTicks;
/*      this.firqHackTicks += singleTicks;
      if (this.firqHackTicks >= CALL_YM2151_FIRQ_HACK_AFTER_TICKS) {
        this.firqHackTicks -= CALL_YM2151_FIRQ_HACK_AFTER_TICKS;
        //TODO only set firq when ym2151 does not output sound
        this.cpu.firq();
      }/**/
    }
    return ticksExecuted;
  }

  /*
    each ROM (U18/U15/U14) is divided in 15 x 32kb blocks (max ROM size is 480kb)
    -> Total 45 x 32kb blocks 1440kb
    -> Block 15 contains the system ROM (Part of the U18 ROM)
   */
  _getBankRomOffset(value) {
    let bankBase = value & 0x0F;
    switch ((~value) & 0xE0) {
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
        console.log('UNKNOWN_SOUND_ROM_BANK_' + value + ' -> ' + bankBase);
    }
    return bankBase << 15;
  }

  //read function for sound CPU
  _cpuRead8(offset) {
    if (this.noRomAvailable) {
      return 0;
    }

    if (isNaN(offset)) {
      throw new TypeError('SOUND_MEMORY_READ_BUG_DETECTED!');
    }

    const address = soundMapper.getAddress(offset);
    //debug('read from adr %o', { address, offset: offset.toString(16) });
    switch (address.subsystem) {

      case soundMapper.SUBSYSTEM_RAM:
        //debug('READ RAM', address.offset);
        return this.ram[address.offset];

      case soundMapper.SUBSYSTEM_HARDWARE:
        return this._hardwareRead(address.offset);

      case soundMapper.SUBSYSTEM_BANKSWITCHED: {
        const readOffset = address.offset + this.romBankOffset;
        debug('READ BANKSWITCHED', address.offset, readOffset, this.concatenatedSoundRom[readOffset]);
        return this.concatenatedSoundRom[readOffset];
      }

      case soundMapper.SUBSYSTEM_ROM:
        //debug('READ ROM', address.offset);
        return this.systemROM[address.offset];

      default:
        console.log('wpcemu:boards:sound-board: CPU_READ8_FAIL', JSON.stringify(address), offset);
        throw new Error('SND_INVALID_READ_SUBSYSTEM');
    }
  }

  //write function for sound CPU
  _cpuWrite8(offset, value) {
    if (this.noRomAvailable) {
      return;
    }
    if (isNaN(offset)) {
      throw new TypeError('SOUND_MEMORY_WRITE_BUG_DETECTED!');
    }
    if (value === undefined) {
      throw new TypeError('MEMORY WRITE VALUE BUG DETECTED!');
    }

    value &= 0xFF;

    const address = soundMapper.getAddress(offset);

    //debug('write to adr %o', { address, offset: offset.toString(16), value });
    switch (address.subsystem) {

      case soundMapper.SUBSYSTEM_RAM:
        this.ram[address.offset] = value;
        break;

      case soundMapper.SUBSYSTEM_HARDWARE:
        this._hardwareWrite(address.offset, value);
        break;

      default:
        debug('wpcemu:boards:sound-board: CPU_WRITE8_FAIL', { offset: '0x' + offset.toString(16), subsstem: address.subsystem, value });
        //throw new Error('SND_INVALID_WRITE_SUBSYSTEM_0x' + address.offset.toString(16));
    }
  }

  mixStereo(audioBuffer, sampleCount, offset) {
    this.ym2151.mixStereo(audioBuffer, sampleCount, offset);
  }

  registerDacCallback(dacCallback) {
    this.dacCallback = dacCallback;
  }

  // Interface from CPU board
  writeInterface(offset, value) {
    this.ram[offset] = value;

    switch (offset) {
      case OP.WPC_SOUND_CONTROL_STATUS:
        debug('WRITE_SND', REVERSEOP[offset], value);
        this.reset();
        //sndbrd_0_ctrl_w(0,data);
        /*
        cpunum_set_reset_line(locals.brdData.cpuNo, PULSE_LINE);
        */
        break;

      case OP.WPC_SOUND_DATA:
        debug('WRITE_SND', REVERSEOP[offset], value);
        console.log('write sound data', value);
        this._hardwareWrite(OP.WPC_LATCH_WRITE, value);
        break;

      default:
        debug('wpcemu:boards:sound-board W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        console.log('SND_W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  readInterface(offset) {
    switch (offset) {
      case OP.WPC_SOUND_CONTROL_STATUS:
        //console.log('SND READ', REVERSEOP[offset]);
        //TODO return if ?? if data is available (latch not read) else return ??
        return this._hardwareRead(soundMapper.ADDRESS_YM2151_REGISTER);

      case OP.WPC_SOUND_DATA:
        debug('WPC_SOUND_DATA', REVERSEOP[offset]);
        return this._hardwareRead(OP.WPC_LATCH_READ);

      default:
        console.log('wpcemu:boards:sound-board R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        debug('SND_R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        return 0;
    }
  }

  _hardwareWrite(offset, value) {
    switch (offset) {
      case OP.WPC_ROMBANK_W: {
        if ([ 111, 127 ].includes(value)) { // 491520 -> 15
          console.log('SYSTEM ROM BANK REQUESTED!!!!');
        }
        const newRomBank = this._getBankRomOffset(value);
        if (newRomBank !== this.romBankOffset) {
          this.romBankOffset = newRomBank;
          debug('WRITE WPC_ROMBANK_W', value, this.romBankOffset);
        }
        break;
      }

      case soundMapper.ADDRESS_YM2151_REGISTER:
        //store address to be written
        this.ym2151Register0 = value;
        //this.ym2151.SetReg(0, value);
        //console.log('W SELECT_YM2151_REGISTER', value, YM2151_REGISTER[value]);
        break;

      case soundMapper.ADDRESS_YM2151_DATA:
        //using this make the firq timer work!
        //this.ym2151.SetReg(value, this.ym2151Register0);
        this.ym2151.SetReg(this.ym2151Register0, value);

        //this.ym2151.SetReg(0, this.ym2151Register0);
        //this.ym2151.SetReg(1, value);
/*       if (value!==21)
       console.log('WRITE ADDRESS_YM2151_DATA', {
          register: this.ym2151Register0,
          value,
          name: ym2151Mapper.getRegisterName(value),
        });/**/
        //console.log('WRITE ADDRESS_YM2151_DATA', value, YM2151_REGISTER[value]);
        break;

      case OP.WPC_DAC_WRITE:
        //const analogValue = value;
        //console.log('WRITE ADDRESS_DAC_WRITE', analogValue);
        //debug('WRITE ADDRESS_DAC_WRITE', value);
        this.dacCallback(value);
        break;

      case OP.HC55516_CLOCK_SET_WRITE:
        debug('WRITE HC55516_CLOCK_SET_WRITE', value);
        //console.log('IGNORE_WRITE ADDRESS_HC55516_CLOCK_SET_WRITE', value);
        break;

      case OP.HC55516_DIGIT_CLOCK_CLEAR_WRITE:
        debug('WRITE HC55516_DIGIT_CLOCK_CLEAR_WRITE', value);
        //console.log('IGNORE_WRITE ADDRESS_HC55516_DIGIT_CLOCK_CLEAR_WRITE', value);
        break;

      case OP.WPC_VOLUME_WRITE:
        //this.ym2151.SetVolume();
        if (value & 0x01) {
          if ((this.volume > 0) && (value & 0x02)) {
            this.volume -= 1;
          } else if ((this.volume < 0xFF) && ((value & 0x02) === 0)) {
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
        debug('WRITE WPC_VOLUME_WRITE %o', { value, volume: this.volume });
        break;

      case OP.WPC_LATCH_WRITE:
        debug('WRITE WPC_LATCH_WRITE', value);
        this.soundData = value;
        //console.log('latch_irq', value);
        this.cpu.irq();
        //fire FIRQ line on CPU Board, ACK
        this.interruptCallback.firq();
        break;

      default:
        console.log('SND_INVALID_HW_WRITE', '0x' + offset.toString(16), value);
        debug('SND_INVALID_HW_WRITE', '0x' + offset.toString(16), value);
        break;
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

      case soundMapper.ADDRESS_YM2151_REGISTER:
        //return 0xFF;
        return this.ym2151Register0;

      case OP.WPC_LATCH_READ:
        debug('READ WPC_LATCH_READ', this.soundData);
        //console.log('ADDRESS_WPC_LATCH_READ', this.soundData);
        this.cpu.clearIrqMasking();
/*        const value = this.soundData;
        this.soundData = NO_SOUND_DATA_READY;
        return value;*/
        return this.soundData;

      default:
        console.log('SND_INVALID_HW_READ', '0x' + offset.toString(16));
        debug('SND_INVALID_HW_READ', '0x' + offset.toString(16));
        throw new Error('SND_INVALID_READ_SUBSYSTEM_0x' + offset.toString(16));
    }
  }
}

/*

18:28:10.430 browser.js:133 wpcemu:boards:externalIO W_NOT_IMPLEMENTED +15s 0x3fdf 144
18:28:10.431 browser.js:133 wpcemu:boards:externalIO W_NOT_IMPLEMENTED +0ms 0x3fde 0
18:28:10.431 browser.js:133 wpcemu:boards:externalIO W_NOT_IMPLEMENTED +1ms 0x3fdc 1
18:28:10.432 browser.js:133 wpcemu:boards:externalIO W_NOT_IMPLEMENTED +0ms 0x3fdb 249

$2000-$37FF	Expansion (maybe security chip of WPC-S and WPC-95)
$3FC0-$3FDF	    External I/O control
                Address	  Format	 Description
                $3FC0     Byte     WPC_PARALLEL_STATUS_PORT
                $3FC1     Byte     WPC_PARALLEL_DATA_PORT
                $3FC2     Byte     WPC_PARALLEL_STROBE_PORT
                $3FC3     Byte     WPC_SERIAL_DATA_OUTPUT
                $3FC4     Byte     WPC_SERIAL_CONTROL_OUTPUT
                $3FC5     Byte     WPC_SERIAL_BAUD_SELECT
                $3FC6     Byte     WPC_TICKET_DISPENSE, Ticket dispenser board
                $3FD1     Byte     sound? only for GEN_WPCALPHA_1?
                $3FD4     Byte     WPC_FLIPTRONIC_PORT_A
                $3FD6     Byte     WPC_FLIPTRONIC_PORT_B (Ununsed)
                $3FDC     Byte     WPCS_DATA (7-0: R/W: Send/receive a byte of data to/from the sound board)
                                   WPC_SOUNDIF
                $3FDD     Byte     WPCS_CONTROL_STATUS aka WPC_SOUNDBACK
                                    7: R: WPC sound board read ready
                                    0: R: DCS sound board read ready
                                    or RW: R: Sound data availble, W: Reset soundboard ?

*/
