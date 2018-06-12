'use strict';

const EXTERNALIO_MEMORY_SIZE = 32;


const OP = {
  WPC_PARALLEL_STROBE_PORT: 0x3FC2,
  WPC_TICKET_DISPENSE: 0x3FC6,
  WPC_FLIPTRONICS_FLIPPERS: 0x3FD4,
};

const REVERSEOP = [];
Object.keys(OP).forEach((key) => {
  REVERSEOP[OP[key]] = key;
});


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
      case OP.WPC_PARALLEL_STROBE_PORT:
      case OP.WPC_TICKET_DISPENSE:
      case OP.WPC_FLIPTRONICS_FLIPPERS:
        break;
      default:
        console.log('IO W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
    }
  }

  read(offset) {
    switch (offset) {
      case OP.WPC_PARALLEL_STROBE_PORT:
      case OP.WPC_TICKET_DISPENSE:
      case OP.WPC_FLIPTRONICS_FLIPPERS:
        break;
      default:
        console.log('IO R_NOT_IMPLEMENTED', '0x' + offset.toString(16));
    }
    const _offset = offset - 0x3FC0;
    return this.ram[_offset];
  }
}
/*
*/
