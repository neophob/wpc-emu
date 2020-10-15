'use strict';

const debug = require('debug')('wpcemu:boards:sound-board');
const SoundSerialInterface = require('./elements/sound-serial-interface');

const OP = {
  WPC_LATCH_READ: 0x3000,
  WPC_LATCH_WRITE: 0x3C00,

  WPC_SOUND_CONTROL_STATUS: 0x3FDD,
  WPC_SOUND_DATA: 0x3FDC,
};

/*
see https://github.com/bcd/freewpc/blob/83161e2f62636cd5888af747a40d7727df1f13fa/include/system/sound.h
*/

module.exports = {
  getInstance,
  OP,
};

/**
 * Create a new instance of the sound board, compatible with preDCS, DCS and WPC-95 Sound Boards
 * @function
 * @param {Object} initObject JSON Configuration Object
 * @param {Array} initObject.romObject.preDcsSoundboard preDCS boards use 8bit to communicate with the CPU board, DCS and later use 16 bit
 * @return {SoundBoard} instance
  */

function getInstance(initObject) {
  return new SoundBoard(initObject);
}

class SoundBoard {

  constructor(initObject) {
    const isPreDcsSoundBoard = initObject.romObject.preDcsSoundboard === true;
    this.soundSerialInterface = SoundSerialInterface.getInstance(isPreDcsSoundBoard);
    this.readDataBytes = 0;
    this.writeDataBytes = 0;
    this.readControlBytes = 0;
    this.writeControlBytes = 0;
    this.resetCount = 0;
  }

  reset() {
    debug('RESET_SOUNDBOARD');
    this.soundSerialInterface.reset();
    this.readDataBytes = 0;
    this.writeDataBytes = 0;
    this.readControlBytes = 0;
    this.writeControlBytes = 0;
    this.resetCount++;
  }

  getState() {
    return {
      volume: this.soundSerialInterface.volume,
      readDataBytes: this.readDataBytes,
      writeDataBytes: this.writeDataBytes,
      readControlBytes: this.readControlBytes,
      writeControlBytes: this.writeControlBytes,
    };
  }

  setState(soundState) {
    if (!soundState) {
      return false;
    }
    this.soundSerialInterface.volume = soundState.volume;
    this.readDataBytes = soundState.readDataBytes;
    this.writeDataBytes = soundState.writeDataBytes;
    this.readControlBytes = soundState.readControlBytes;
    this.writeControlBytes = soundState.writeControlBytes;
  }

  registerSoundBoardCallback(callbackFunction) {
    if (typeof callbackFunction !== 'function') {
      console.log('ERROR: INVALID CALLBACK FUNCTION');
      return false;
    }
    this.soundSerialInterface.registerCallBack(callbackFunction);
  }

  // Interface from CPU board
  writeInterface(offset, value) {
    switch (offset) {
      case OP.WPC_SOUND_CONTROL_STATUS: {
        this.writeControlBytes++;
        const needReset = this.soundSerialInterface.writeControl(value);
        if (needReset) {
          this.reset();
        }
        break;
      }

      case OP.WPC_SOUND_DATA:
        if (this.resetCount > 20 && value === 0) {
          this.resetCount = 0;
          console.log('ignore first 0 after multiple soundboard reset!');
          return;
        }
        debug('WRITE WPC_LATCH_WRITE', value);
        this.writeDataBytes++;
        this.soundSerialInterface.writeData(value);
        break;

      default:
        debug('wpcemu:boards:sound-board W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        console.log('SND_W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  readInterface(offset) {
    switch (offset) {
      case OP.WPC_SOUND_CONTROL_STATUS: {
        this.readControlBytes++;
        const soundControlValue = this.soundSerialInterface.readControl();
        debug('READ_WPC_SOUND_CONTROL_STATUS', soundControlValue);
        return soundControlValue;
      }

      case OP.WPC_SOUND_DATA: {
        this.readDataBytes++;
        const soundDataValue = this.soundSerialInterface.readData();
        debug('READ WPC_LATCH_READ', soundDataValue);
        return soundDataValue;
      }

      default:
        console.log('wpcemu:boards:sound-board R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        debug('SND_R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        return 0;
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
