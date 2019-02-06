'use strict';

const debug = require('debug')('wpcemu:boards:sound-board');

const soundMapper = require('./mapper/sound.js');
const volumeConverter = require('./elements/sound-volume-convert');

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

// If no data is ready, returns 0xFF.
const NO_SOUND_DATA_READY = 0xFF;

//DCS
const SOUND_COMMAND_VOLUME = 0x55;
const SOUND_COMMAND_GLOBAL_VOLUME = 0x55AA;
const SOUND_COMMAND_STOPALL = 0x0000;

//PREDCS NOT IMPLEMENTED YET
const PREDCS_VOLUME_COMMAND = 0x79;

/*
SET VOLUME 11
WRITE WPC_LATCH_WRITE 79    << volume cmd
WRITE WPC_LATCH_WRITE b     << actual volume
WRITE WPC_LATCH_WRITE f4    << 0xFF - 0xF4 = 0xB, why again?
WRITE WPC_LATCH_WRITE 2     << ??
WRITE WPC_LATCH_WRITE 7e    << ?? SND_STOP_MUSIC

see https://github.com/bcd/freewpc/blob/83161e2f62636cd5888af747a40d7727df1f13fa/include/system/sound.h

*/

module.exports = {
  getInstance,
};

/**
 * Create a new instance of the sound board, compatible with preDCS, DCS and WPC-95 Sound Boards
 * @function
 * @param {Object} initObject JSON Configuration Object
 * @param {Object} initObject.interruptCallback firq callback function
 * @param {Array} initObject.romObject.preDcsSoundboard preDCS boards use 8bit to communicate with the CPU board, DCS and later use 16 bit
 * @return {SoundBoard} instance
  */

function getInstance(initObject) {
  return new SoundBoard(initObject);
}

class SoundBoard {

  constructor(initObject) {
    this.interruptCallback = initObject.interruptCallback;
    this.preDcsBoard = initObject.romObject.preDcsSoundboard;
    this.volume = 0;
    this.soundData = NO_SOUND_DATA_READY;
    this.latchedWriteCommand = [];
    this.soundBoardPlayIdCallback = () => {};
  }

  reset() {
    console.log('RESET_SOUNDBOARD', this.preDcsBoard);
    this.volume = 0;
    this.soundData = NO_SOUND_DATA_READY;
    this.latchedWriteCommand = [];
    //trigger sound stop on the frontend
    this.soundBoardPlayIdCallback(0);
  }

  getState() {
    const state = {
      volume: this.volume,
    };
    return state;
  }

  registerSoundBoardPlayIdCallback(callbackFunction) {
    if (typeof callbackFunction !== 'function') {
      console.log('ERROR: INVALID CALLBACK FUNCTION');
      return false;
    }
    this.soundBoardPlayIdCallback = callbackFunction;
  }

  // Interface from CPU board
  writeInterface(offset, value) {

    switch (offset) {
      case OP.WPC_SOUND_CONTROL_STATUS:
        debug('WRITE_SND WPC_SOUND_CONTROL_STATUS', value);
        this.reset();
        break;

      case OP.WPC_SOUND_DATA:
        debug('WRITE_SND WPC_SOUND_DATA', value);
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
        debug('READ_WPC_SOUND_DATA WPC_SOUND_DATA');
        return this._hardwareRead(OP.WPC_LATCH_READ);

      default:
        console.log('wpcemu:boards:sound-board R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        debug('SND_R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        return 0;
    }
  }

  _hardwareWrite(offset, value) {
    switch (offset) {
      case OP.WPC_ROMBANK_W:
      case soundMapper.ADDRESS_YM2151_REGISTER:
      case soundMapper.ADDRESS_YM2151_DATA:
      case OP.WPC_DAC_WRITE:
      case OP.HC55516_CLOCK_SET_WRITE:
      case OP.HC55516_DIGIT_CLOCK_CLEAR_WRITE:
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
        console.log('WRITE WPC_VOLUME_WRITE %o', { value, volume: this.volume });
        break;

      case OP.WPC_LATCH_WRITE:
        debug('WRITE WPC_LATCH_WRITE', value);
        console.log('WRITE WPC_LATCH_WRITE', value.toString(16), this.latchedWriteCommand);

        if (this.preDcsBoard) {
          this.soundBoardPlayIdCallback(value);
        } else {
          this._processDcsSoundCommand(value);
        }
        break;

      default:
        console.log('SND_INVALID_HW_WRITE', '0x' + offset.toString(16), value);
        debug('SND_INVALID_HW_WRITE', '0x' + offset.toString(16), value);
        break;
    }
  }

  //TODO move this into a separate class!
  _processDcsSoundCommand(value) {
    this.latchedWriteCommand.push(value);
    if (this.latchedWriteCommand.length === 2) {

      const soundCommand = (this.latchedWriteCommand[0] << 8) | this.latchedWriteCommand[1];

      if (soundCommand === SOUND_COMMAND_STOPALL) {
        console.log('STOP_ALL_SOUND');
        this.latchedWriteCommand = [];
        //TODO CALLBACK, stop all playing music
        return;
      }

      if (soundCommand === 0x3D3) {
        this.latchedWriteCommand = [];
        this.soundData = 0x1E;
        return;
      }

      if (this.latchedWriteCommand[0] === SOUND_COMMAND_VOLUME) {
        this.pendingVolumeCommand = soundCommand;
        this.latchedWriteCommand = [];
        return;
      }

      if (this.pendingVolumeCommand) {
        if (this.pendingVolumeCommand === SOUND_COMMAND_GLOBAL_VOLUME) {
          this.volume = volumeConverter.getRelativeVolume(soundCommand);
          console.log('SET_GLOBAL_VOLUME_TO', soundCommand.toString(16), this.volume);
          //TODO CALLBACK, set Volume
        } else {
          console.log('CHANNEL_VOLUME_NOT_IMPLEMENTED', soundCommand.toString(16));
        }
        this.pendingVolumeCommand = undefined;
        this.latchedWriteCommand = [];
        return;
      }



      this.latchedWriteCommand = [];
      this.soundBoardPlayIdCallback(soundCommand);
      //fire FIRQ line on CPU Board, ACK
      //this.interruptCallback.irq();
    }

  }

  _hardwareRead(offset) {
    switch (offset) {
      case soundMapper.ADDRESS_YM2151_DATA:
        debug('READ ADDRESS_YM2151_DATA');
        // bit 0: timer a, bit 1: timer b, bit 7 busy
        // after writing to the register, the cpu is busy for some time - a read must return 0 before
        // next write can happen
        return 0x00;

      case soundMapper.ADDRESS_YM2151_REGISTER:
        return 0xFF;

      case OP.WPC_LATCH_READ:
        const value = this.soundData;
        console.log('WPC_LATCH_READ', value);
        debug('READ WPC_LATCH_READ', value);
        this.soundData = 0x80;
        return value;

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
