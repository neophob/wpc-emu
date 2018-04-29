'use strict';

const Debug = require('debug');
const debug = Debug('Emulator');
const RomHelper = require('./rom/');
const CPU6809 = require('./cpu6809');
const WpcAsic = require('./wpcasic');

module.exports = {
  initVMwithRom,
};

const CALL_IRQ_AFTER_TICKS = 2049;//1952;
const CALL_ZEROCLEAR_AFTER_TICKS = 16667;
//const CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS = 16667;

const CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS = 8696;
// A 128x32 plasma display with 16 pages and refreshed at 240Hz (for PWM luminosity control)

class Emulator {
  constructor(romObject) {
    // The CPU's NMI input is not used and is connected to Vcc.
    const interruptCallback = {
      irq: CPU6809.irq,
      firq: CPU6809.firq,
      reset: CPU6809.reset,
    };
    this.asic = WpcAsic.getInstance(romObject, interruptCallback);
    this.fastForwardOps = 0;

    this.ticksIrq = 0;
    this.ticksZeroCross = 0;
    this.ticksUpdateDmd = 0;
  }

  _fastForwardCycles(cycles) {
    debug('fast forward to cycle', cycles);
    const debugEnabled = debug.enabled;
    Debug.disable('*');
    var actualCycles = 0;
    while (actualCycles < cycles) {
      actualCycles = this.executeCycle();
    }
    if (debugEnabled) {
      Debug.enable('*');
    }
    this.fastForwardOps = CPU6809.T();
  }

  start(initialCycles = 577000000) {
    debug('start WPC');
    const readMemory = this.asic.read8.bind(this.asic);
    const writeMemory = this.asic.write8.bind(this.asic);
    CPU6809.init(writeMemory, readMemory);
    this.asic.start();
    CPU6809.irq();

    if (initialCycles) {
      this._fastForwardCycles(initialCycles);
    }
    this.startTime = Date.now();
  }

  getUiState() {
    const ticks = CPU6809.T();
    return {
      asic: this.asic.getUiState(),
      ticks,
      opMs: parseInt((ticks - this.fastForwardOps) / (Date.now()-this.startTime))
    };
  }

  executeCycle() {
    const oldTicks = CPU6809.ticks();
    CPU6809.steps(2000);
    const ticks = CPU6809.ticks() - oldTicks;

    this.ticksIrq += ticks;
    this.ticksZeroCross += ticks;
    this.ticksUpdateDmd += ticks;

    if (this.ticksIrq > CALL_IRQ_AFTER_TICKS) {
      this.ticksIrq -= CALL_IRQ_AFTER_TICKS;
      if (this.asic.isPeriodicIrqEnabled()) {
        CPU6809.irq();
      }
    }
    if (this.ticksZeroCross > CALL_ZEROCLEAR_AFTER_TICKS) {
      this.ticksZeroCross -= CALL_ZEROCLEAR_AFTER_TICKS;
      this.asic.setZeroCrossFlag();
    }
    if (this.ticksUpdateDmd > CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS) {
      this.ticksUpdateDmd -= CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS;
      this.asic.boardDmd.executeCycle();
    }
    return CPU6809.ticks();
  }
  setCabinetInput(value) {
    this.asic.setCabinetInput(value);
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
