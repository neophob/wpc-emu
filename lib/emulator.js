'use strict';

const debug = require('debug')('Emulator');
const RomHelper = require('./rom/');
const CPU6809 = require('./cpu6809');
const WpcAsic = require('./wpcasic');

module.exports = {
  initVMwithRom,
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
    this.emucycle = 0;
  }

  start() {
    debug('start WPC');
    const readMemory = this.asic.read8.bind(this.asic);
    const writeMemory = this.asic.write8.bind(this.asic);
    CPU6809.init(writeMemory, readMemory);
    this.startTime = Date.now();
    this.asic.start();
    CPU6809.irq();
  }

  getUiState() {
    const ticks = CPU6809.T();
    return {
      asic: this.asic.getUiState(),
      ticks,
      opMs: parseInt(ticks / (Date.now()-this.startTime))
    };
  }

  executeCycle() {
    // CPU is clocked 2MHZ, 2'000'000 ticks / s
    CPU6809.steps(TICKS_TO_RUN);
    if (this.asic.isPeriodicIrqEnabled()) {
      CPU6809.irq();
    }
    this.emucycle++;
  }

  irq() {
    CPU6809.irq();
  }
  firq() {
    CPU6809.firq();
  }
}

function initVMwithRom(romFile, fileName) {
  debug('initVMwithRom');
  return RomHelper.parse(romFile, fileName)
    .then((romObject) => {
      debug('loading rom succesfull');
      return new Emulator(romObject);
    });
}
