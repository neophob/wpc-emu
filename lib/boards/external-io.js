'use strict';

const EXTERNALIO_MEMORY_SIZE = 32;

const OP = {
  WPC_PARALLEL_STATUS_PORT: 0x3FC0,
  WPC_PARALLEL_DATA_PORT: 0x3FC1,
  WPC_PARALLEL_STROBE_PORT: 0x3FC2,
  WPC_SERIAL_DATA_OUTPUT: 0x3FC3,
  WPC_SERIAL_CONTROL_OUTPUT: 0x3FC4,
  WPC_SERIAL_BAUD_SELECT: 0x3FC5,
  WPC_TICKET_DISPENSE: 0x3FC6,
  //UNUSED
  WPC_FLIPTRONICS_FLIPPER_PORT_B: 0x3FD5,
};

const TICKET_DISPENSE_NOT_AVAILABLE = 0xFF;

module.exports = {
  getInstance,
};

function getInstance() {
  return new ExternalIo();
}

class ExternalIo {

  constructor() {
    this.ram = new Uint8Array(EXTERNALIO_MEMORY_SIZE).fill(0);
  }

  write(offset, value) {
    const _offset = offset - 0x3FC0;
    this.ram[_offset] = value;

    switch (offset) {
      case OP.WPC_PARALLEL_STATUS_PORT:
      case OP.WPC_PARALLEL_DATA_PORT:
      case OP.WPC_PARALLEL_STROBE_PORT:
      case OP.WPC_SERIAL_DATA_OUTPUT:
      case OP.WPC_SERIAL_CONTROL_OUTPUT:
      case OP.WPC_SERIAL_BAUD_SELECT:
      case OP.WPC_TICKET_DISPENSE:
      case OP.WPC_FLIPTRONICS_FLIPPER_PORT_B:
        break;

      default:
        console.log('IO W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
    }
  }

  read(offset) {
    const _offset = offset - 0x3FC0;

    switch (offset) {
      case OP.WPC_TICKET_DISPENSE:
        return TICKET_DISPENSE_NOT_AVAILABLE;

      case OP.WPC_PARALLEL_STATUS_PORT:
      case OP.WPC_PARALLEL_DATA_PORT:
      case OP.WPC_PARALLEL_STROBE_PORT:
      case OP.WPC_SERIAL_DATA_OUTPUT:
      case OP.WPC_SERIAL_CONTROL_OUTPUT:
      case OP.WPC_SERIAL_BAUD_SELECT:
      case OP.WPC_FLIPTRONICS_FLIPPER_PORT_B:
        break;

      default:
        console.log('IO R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
    }
    return this.ram[_offset];
  }
}
/*
*/
