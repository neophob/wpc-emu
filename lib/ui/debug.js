'use strict';

const debug = require('debug')('UI:Debug');

module.exports = {
  getInstance
};

function getInstance(romName) {
  return new UI(romName);
}

class UI {

  constructor(romName) {
    debug('init', romName);
  }

  //ROMNAME, DEBUG LEDS, CPU ticks

  drawState(ascicState, cpuTicks) {
    //TODO
    this.cpuTicks =  cpuTicks;
  }
}
