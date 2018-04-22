'use strict';

const debug = require('debug')('wpcemu:boards:externalIo');

const WPC_SOUND_CONTROL_STATUS = 0x3FDD;

module.exports = {
  getInstance
};

function getInstance() {
  return new ExternalIo();
}

/*

  wpcemu:boards:externalIo W_NOT_IMPLEMENTED 0x3FC6 0 +0ms WPC_TICKET_DISPENSE
  wpcemu:boards:externalIo W_NOT_IMPLEMENTED 0x3fc2 1 +0ms WPC_PARALLEL_STROBE_PORT
*/
class ExternalIo {
  constructor() {
  }

  write(offset, value) {
    switch (offset) {

      case WPC_SOUND_CONTROL_STATUS:
        //debug('WRITE WPC_SOUND_CONTROL_STATUS', value);
        break;

      default:
        debug('W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  read(offset) {
    switch (offset) {
      case WPC_SOUND_CONTROL_STATUS:
        return 0x0;//ff;

      default:
        debug('R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
        break;
    }
  }
}

/*
$3FC0-$3FDF	    External I/O control
                Address	  Format	 Description
                $3FC0     Byte     WPC_PARALLEL_STATUS_PORT
                $3FC1     Byte     WPC_PARALLEL_DATA_PORT
                $3FC2     Byte     WPC_PARALLEL_STROBE_PORT
                $3FC3     Byte     WPC_SERIAL_DATA_OUTPUT
                $3FC4     Byte     WPC_SERIAL_CONTROL_OUTPUT
                $3FC5     Byte     WPC_SERIAL_BAUD_SELECT
                $3FC6     Byte     WPC_TICKET_DISPENSE
                $3FD4     Byte     WPC_FLIPTRONIC_PORT_A
                $3FD6     Byte     WPC_FLIPTRONIC_PORT_B (Ununsed)
                $3FDC     Byte     WPCS_DATA (7-0: R/W: Send/receive a byte of data to/from the sound board)
                $3FDD     Byte     WPCS_CONTROL_STATUS
                                    7: R: WPC sound board read ready
                                    0: R: DCS sound board read ready

*/
