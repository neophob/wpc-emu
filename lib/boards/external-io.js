'use strict';

const debug = require('debug')('wpcemu:boards:externalIO');
const SoundBoard = require('./sound');

const OP = {
  WPC_PARALLEL_STROBE_PORT: 0x3FC2,
  WPC_TICKET_DISPENSE: 0x3FC6,
  WPC_SOUND_CONTROL_STATUS: 0x3FDD,
  WPC_SOUND_DATA: 0x3FDC,
};

const REVERSEOP = [];
Object.keys(OP).forEach((key) => {
  REVERSEOP[OP[key]] = key;
});

module.exports = {
  getInstance,
};

function getInstance(initObject) {
  return new ExternalIo(initObject);
}

class ExternalIo {

  constructor(initObject) {
    this.ram = initObject.ram;
    this.interruptCallback = initObject.interruptCallback;
    this.soundboard = SoundBoard.getInstance();
  }

  write(offset, value) {
    this.ram[offset] = value;

    switch (offset) {
      case OP.WPC_PARALLEL_STROBE_PORT:
      case OP.WPC_TICKET_DISPENSE:
        debug('WRITE', REVERSEOP[offset], value);
        break;

      case OP.WPC_SOUND_CONTROL_STATUS:
        //debug('WRITE_SND', REVERSEOP[offset], value);
        //sndbrd_0_ctrl_w(0,data);
        this.soundboard.writeControlStatus(value);
        break;

      case OP.WPC_SOUND_DATA:
        debug('WRITE_SND', REVERSEOP[offset], value);
        //TODO sndbrd_0_data_w(0,data);
        this.soundboard.writeSoundData(value);
        break;

      default:
        debug('W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  read(offset) {
    switch (offset) {
      case OP.WPC_SOUND_CONTROL_STATUS:
        //debug('READ', REVERSEOP[offset]);
        //TODO return sndbrd_0_data_r(0);
        this.interruptCallback.firq();
        return 0x80;

      case OP.WPC_SOUND_DATA:
        debug('READ', REVERSEOP[offset]);
        return this.soundboard.readSoundData();

      default:
        debug('R_NOT_IMPLEMENTED', '0x' + offset.toString(16), this.ram[offset]);
        return this.ram[offset];
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
