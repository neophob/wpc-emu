'use strict';

// Williams part numbers A-15472

const debug = require('debug')('wpcemu:boards:fliptronicsboard');

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
*/

class FliptronicsBoard {
  constructor() {
  }

  setInput(value) {
    console.log('setFliptronicsInput', value);
  }

  write(offset, value) {

  }

  read(offset) {

  }
}
