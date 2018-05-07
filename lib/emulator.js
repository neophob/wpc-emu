'use strict';

const debugInstance = require('debug');
const RomHelper = require('./rom/index');
const CPU6809 = require('./boards/up/cpu6809');
const WpcAsic = require('./wpcasic');

const debug = debugInstance('Emulator');

module.exports = {
  initVMwithRom,
};

// IRQ is generated 976 times per second
const CALL_IRQ_AFTER_TICKS = 2049;

// ZeroCross should occur 120 times per second (NTSC running at 60Hz)
const CALL_ZEROCLEAR_AFTER_TICKS = 16667;

// one scanline has 128 pixels -> packed in 16 bytes it takes 32 CPU cycles to transfer one byte
const CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS = 512;
// A 128x32 plasma display with 16 pages and refreshed at 240Hz (for PWM luminosity control)

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
    this.fastForwardOps = 0;

    this.ticksIrq = 0;
    this.ticksZeroCross = 0;
    this.ticksUpdateDmd = 0;
  }

  _invalidNVRAMBootWorkaround() {
    // it looks like the WPC systems initialise the RAM when its invalid. this takes about 15M CPU cycles
    // after that, a CPU Reset is needed and the game runs
    CPU6809.steps(15 * 1000000);
    CPU6809.reset();
    // i guess thats only needed because nvram is not init
    CPU6809.irq();
    this.fastForwardOps = CPU6809.T();
    this.startTime = Date.now();
  }

  start() {
    debug('start WPC');
    const readMemory = this.asic.read8.bind(this.asic);
    const writeMemory = this.asic.write8.bind(this.asic);
    this.fastForwardOps = 0;

    CPU6809.init(writeMemory, readMemory);
    this._invalidNVRAMBootWorkaround();

    debug('PC', CPU6809.status().pc);
    this.startTime = Date.now();
  }

  getUiState() {
    const ticks = CPU6809.T();
    return {
      asic: this.asic.getUiState(),
      ticks,
      opMs: parseInt((ticks - this.fastForwardOps) / (Date.now() - this.startTime), 10)
    };
  }

  // MAIN LOOP
  executeCycle() {
    const currentTicks = CPU6809.ticks();
    const ticksToRun = 512;
    const ticks = CPU6809.steps(ticksToRun) - currentTicks;

    this.ticksIrq += ticks;
    this.ticksZeroCross += ticks;
    this.ticksUpdateDmd += ticks;

    if (this.ticksIrq >= CALL_IRQ_AFTER_TICKS) {
      this.ticksIrq -= CALL_IRQ_AFTER_TICKS;
      if (this.asic.isPeriodicIrqEnabled()) {
        CPU6809.irq();
      }
    }
    if (this.ticksZeroCross >= CALL_ZEROCLEAR_AFTER_TICKS) {
      this.ticksZeroCross -= CALL_ZEROCLEAR_AFTER_TICKS;
      this.asic.setZeroCrossFlag();
    }
    if (this.ticksUpdateDmd >= CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS) {
      this.ticksUpdateDmd -= CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS;
      this.asic.boardDmd.executeCycle();
    }
    this.asic.executeCycle(ticks);

    return CPU6809.ticks();
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
    CPU6809.reset();
    CPU6809.irq();
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
