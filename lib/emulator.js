'use strict';

const debug = require('debug')('Emulator');
const RomHelper = require('./rom/');
const CPU6809 = require('./cpu6809');
const WpcAsic = require('./wpcasic');

module.exports = {
  initVMwithRom,
};

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
    //At 2MHz, the IRQ is triggered about once every 1952 CPU cycles, which
    //is not much, especially considering that 6809 instructions often require
    //3 or 4 cycles to execute.

    // 976 / 1s
    // 1s = 2'000'000
    // 976/2000000 -> each 488us
    CPU6809.steps(TICKS_TO_RUN);

    // irq should be triggered 976 times/s, it is triggered after 1952 cpu cycles
    // 1 cycle takes 1000ms/2'000'000 = 0.0005ms, 1952 cpu cycles take 0.976ms
    if (this.asic.isPeriodicIrqEnabled()) {
      CPU6809.irq();
    }
    // zerocross should occour 120 times per second, so each 8.3ms
    if (this.emucycle % 8 === 0) {
      this.asic.setZeroCrossFlag();
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
