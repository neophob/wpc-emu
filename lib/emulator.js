'use strict';

const debug = require('debug')('Emulator');
const romloader = require('./rom/loader');
const CPU6809 = require('./cpu6809');
const WpcAsic = require('./wpcasic');

const UI = require('./ui/debug');

module.exports = {
  initVMwithRom
};

//At 2MHz, the IRQ is triggered about once every 1952 CPU cycles, which
//is not much, especially considering that 6809 instructions often require
//3 or 4 cycles to execute.
const TICKS_TO_RUN = 1952;

class Emulator {
  constructor(romObject) {
    // The CPU's NMI input is not used and is connected to Vcc.
    const interruptCallback = {
      irq: CPU6809.irq,
      firq: CPU6809.firq,
      reset: CPU6809.reset,
    };
    this.asic = WpcAsic.getInstance(romObject, interruptCallback);
    this.ui = UI.getInstance(romObject.fileName);
    this.emucycle = 0;
  }

  start() {
    debug('start WPC');
    const readMemory = this.asic.read8.bind(this.asic);
    const writeMemory = this.asic.write8.bind(this.asic);
    CPU6809.init(writeMemory, readMemory);
    this.startTime = Date.now();
    this.asic.start();
  }

  executeCycle() {
    // CPU is clocked 2MHZ, 2'000'000 ticks / s
    CPU6809.steps(TICKS_TO_RUN);
    if (this.asic.isPeriodicIrqEnabled()) {
      CPU6809.irq();
    }

    if (this.emucycle % 256 === 0) {
      //debug('update ui state', this.emucycle);
      const asicState = this.asic.getState();
      this.ui.drawState(asicState, CPU6809.T());
    }

    this.emucycle++;
/*    if (CPU6809.T() > 20000) {
      const timePassedS = (Date.now() - this.startTime)/1000;
      const ticksPerSecond = parseInt(CPU6809.T()/timePassedS);
      if (ticksPerSecond < 1900000) {
        this.ticksToRun += TICKSTEP;
      } else if (this.ticksToRun > TICKSTEP && ticksPerSecond > 2100000) {
        this.ticksToRun -= TICKSTEP;
      }
      debug('cpu: %s, ticks/s %s, this.ticksToRun %s', CPU6809.T(), ticksPerSecond, this.ticksToRun);
    }*/
  }

}

function initVMwithRom(romFile, fileName) {
  debug('initVM');
  return romloader.loadRom(romFile, fileName)
    .then((romObject) => {
      debug('loading rom succesfull');
      return new Emulator(romObject);
    });
}
