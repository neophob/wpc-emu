'use strict';

const debugInstance = require('debug');
const RomHelper = require('./rom/index');
const CPU6809 = require('./boards/up/cpu6809');
const CpuBoard = require('./boards/cpu-board');
const timing = require('./boards/timing');

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
        this.cpuBoard.irqSourceDmd(false);
        CPU6809.firq();
      },
      firqFromDmd: () => {
        this.cpuBoard.irqSourceDmd(true);
        CPU6809.firq();
      },
      clearIrqFlag: () => {
        //TODO removeme?
        //CPU6809.clearIrqMasking();
      },
      clearFirqFlag: () => {
        //TODO removeme?
        //CPU6809.clearFirqMasking();
      },
      reset: CPU6809.reset,
    };
    this.cpuBoard = CpuBoard.getInstance(romObject, interruptCallback);
    this.startTime = 0;
    this.ticksIrq = 0;
    this.ticksZeroCross = 0;
    this.ticksUpdateDmd = 0;
  }

  start() {
    debug('start WPC');
    const readMemory = this.cpuBoard.read8.bind(this.cpuBoard);
    const writeMemory = this.cpuBoard.write8.bind(this.cpuBoard);
    this.fastForwardOps = 0;

    CPU6809.init(writeMemory, readMemory);
    this.startTime = Date.now();
    debug('PC', CPU6809.status().pc);
  }

  getUiState() {
    const ticks = CPU6809.T();
    const cpuStatus = CPU6809.status();
    const runtime = Date.now() - this.startTime;
    return {
      asic: this.cpuBoard.getUiState(),
      ticks,
      opsMs: parseInt(ticks / runtime, 10),
      missedIrqCall: cpuStatus.missedIRQ,
      missedFirqCall: cpuStatus.missedFIRQ,
    };
  }

  // MAIN LOOP
  executeCycle(ticksToRun = 500, tickSteps = 4) {
    let ticksExecuted = 0;
    while (ticksExecuted < ticksToRun) {
      const singleTicks = CPU6809.steps(tickSteps);
      ticksExecuted += singleTicks;
      this.ticksIrq += singleTicks;
      if (this.ticksIrq >= timing.CALL_IRQ_AFTER_TICKS) {
        this.ticksIrq -= timing.CALL_IRQ_AFTER_TICKS;
        // TODO isPeriodicIrqEnabled is from freeWpc, unknown if the "real" WPC system implements this too
        // some games needs a manual irq trigger if this is implemented (like indiana jones)
        //if (this.asic.isPeriodicIrqEnabled()) {
        CPU6809.irq();
        //}
      }
      this.cpuBoard.executeCycle(singleTicks);
    }
    return ticksExecuted;
  }

  setCabinetInput(value) {
    this.cpuBoard.setCabinetInput(value);
  }

  setInput(value) {
    this.cpuBoard.setInput(value);
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

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT_EXCEPTION', { error: err.message });
});

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED_REJECTION', { msg: error.message, stack: error.stack });
});

function initVMwithRom(romFile, romObject) {
  debug('initVMwithRom');
  return RomHelper.parse(romFile, romObject)
    .then((romObject) => {
      debug('loading rom succesfull');
      return new Emulator(romObject);
    });
}
