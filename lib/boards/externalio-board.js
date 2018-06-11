'use strict';

const EXTERNALIO_MEMORY_SIZE = 32;


const OP = {
  WPC_PARALLEL_STROBE_PORT: 0x3FC2 - 0x3FC0,
  WPC_TICKET_DISPENSE: 0x3FC6 - 0x3FC0,
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
    this.ram[offset] = value;
  }

  read(offset) {
    return this.ram[offset];
  }
}
/*
*/
