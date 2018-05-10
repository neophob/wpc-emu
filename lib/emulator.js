'use strict';

const debugInstance = require('debug');
const RomHelper = require('./rom/index');
const CPU6809 = require('./boards/up/cpu6809');
const WpcAsic = require('./wpcasic');
const timing = require('./timing');

const debug = debugInstance('Emulator');

module.exports = {
  initVMwithRom,
};

class Emulator {
  constructor(romObject) {
    // The CPU's NMI input is not used and is connected to Vcc.
    const interruptCallback = {
      irq: CPU6809.irq,
      firq: () => {
        this.asic.irqSourceDmd(false);
        CPU6809.firq();
      },
      firqFromDmd: () => {
        this.asic.irqSourceDmd(true);
        CPU6809.firq();
      },
      reset: CPU6809.reset,
    };
    this.asic = WpcAsic.getInstance(romObject, interruptCallback);

    this.ticksIrq = 0;
    this.ticksZeroCross = 0;
    this.ticksUpdateDmd = 0;
  }

  start() {
    debug('start WPC');
    const readMemory = this.asic.read8.bind(this.asic);
    const writeMemory = this.asic.write8.bind(this.asic);
    this.fastForwardOps = 0;

    CPU6809.init(writeMemory, readMemory);
    CPU6809.steps(2000000);
    debug('PC', CPU6809.status().pc);
  }

  getUiState() {
    const ticks = CPU6809.T();
    const cpuStatus = CPU6809.status();
    return {
      asic: this.asic.getUiState(),
      ticks,
      missedIrqCall: cpuStatus.missedIRQ,
      missedFirqCall: cpuStatus.missedFIRQ,
    };
  }

  // MAIN LOOP
  executeCycle(ticksToRun = 500, tickSteps = 4) {
    let ticksExecuted = 0;
    while (ticksExecuted < ticksToRun) {
      ticksExecuted += CPU6809.steps(tickSteps);
      this.ticksIrq += ticksExecuted;
      if (this.ticksIrq >= timing.CALL_IRQ_AFTER_TICKS) {
        this.ticksIrq -= timing.CALL_IRQ_AFTER_TICKS;
        // TODO isPeriodicIrqEnabled is from freeWpc, unknown if the "real" WPC system implements this too
        // some games needs a manual irq trigger if this is implemented (like indiana jones)
        //if (this.asic.isPeriodicIrqEnabled()) {
        CPU6809.irq();
        //}
      }
    }
    this.asic.executeCycle(ticksExecuted);
    return ticksExecuted;
  }

  setCabinetInput(value) {
    this.asic.setCabinetInput(value);
  }

  setInput(value) {
    this.asic.setInput(value);
  }

  irq() {
    CPU6809.irq();
  }

  firq() {
    CPU6809.firq();
  }

  reset() {
    debug('RESET!');
    CPU6809.reset();
    CPU6809.steps(2000000);
    CPU6809.irq();
  }

}

function initVMwithRom(romFile, romObject) {
  debug('initVMwithRom');
  return RomHelper.parse(romFile, romObject)
    .then((romObject) => {
      debug('loading rom succesfull');
      return new Emulator(romObject);
    });
}
