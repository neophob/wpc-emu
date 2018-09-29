'use strict';

// Williams part numbers A-15472

const debug = require('debug')('wpcemu:boards:fliptronicsboard');
const bitmagic = require('./elements/bitmagic');

const MATRIX_COLUMN_SIZE = 1;
const FLIPTRONIC_KEY_OFFSET = 0;
const ALL_SWITCHES_OFF = 0x00;

module.exports = {
  getInstance,
};

function getInstance() {
  return new FliptronicsBoard();
}

/*
/  WPC_FLIPPERS write (active low)
/   0  LL Stroke    4 LU Stroke
/   1  LL Hold      5 LU Hold
/   2  RL Stroke    6 RU Stroke
/   3  RL Hold      7 RU Hold

#define CORE_FLIPPERSWCOL   11   // internal array number


#define WPC_swF1   (CORE_FLIPPERSWCOL*10+1)
#define WPC_swF2   (CORE_FLIPPERSWCOL*10+2)
#define WPC_swF3   (CORE_FLIPPERSWCOL*10+3)
#define WPC_swF4   (CORE_FLIPPERSWCOL*10+4)
#define WPC_swF5   (CORE_FLIPPERSWCOL*10+5)
#define WPC_swF6   (CORE_FLIPPERSWCOL*10+6)
#define WPC_swF7   (CORE_FLIPPERSWCOL*10+7)
#define WPC_swF8   (CORE_FLIPPERSWCOL*10+8)

#define WPC_swLRFlipEOS swF1
#define WPC_swLRFlip    swF2
#define WPC_swLLFlipEOS swF3
#define WPC_swLLFlip    swF4
#define WPC_swURFlipEOS swF5
#define WPC_swURFlip    swF6
#define WPC_swULFlipEOS swF7
#define WPC_swULFlip    swF8

*/

//switches AND solenoids
class FliptronicsBoard {
  constructor() {
    this.switchState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_SWITCHES_OFF);
  }

  setInput(value) {
    if (value[0] !== 'F') {
      debug('INVALID_INPUT_VALUE_' + value);
      return;
    }
    const column = value[1] - 1;
    console.log('setFliptronicsInput', value);
    this._setFliptronicsKey(column);
  }


  _setFliptronicsKey(column) {
    console.log('SET FLIPTRONIC_KEY', column);
    debug('SET FLIPTRONIC_KEY_OFFSET', column);
    this.switchState[FLIPTRONIC_KEY_OFFSET] ^= bitmagic.setMsbBit(column);
  }

  getFliptronicsKeys() {
    return this.switchState[FLIPTRONIC_KEY_OFFSET];
  }

  write(offset, value) {

  }

}
