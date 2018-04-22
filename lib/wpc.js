'use strict';

const debug = require('debug')('wpcemu');
const romloader = require('./romloader');
const CPU6809 = require('./cpu6809');
const WpcAsic = require('./wpcasic');

module.exports = {
  initVMwithRom
};

//const TICKSTEP = 500;

class Wpc {
  constructor(romObject) {
    // The CPU's NMI input is not used and is connected to Vcc.
    const interruptCallback = {
      irq: CPU6809.irq,
      firq: CPU6809.firq,
      reset: CPU6809.reset,
    };
    this.asic = new WpcAsic(romObject, interruptCallback);
    this.ticksToRun = 200000;
  }

  start() {
    debug('start WPC');
    const readMemory = this.asic.read8.bind(this.asic);
    const writeMemory = this.asic.write8.bind(this.asic);
    CPU6809.init(writeMemory, readMemory);
    this.startTime = Date.now();
    this.asic.start();
/*
    static INTERRUPT_GEN(wpc_vblank);
    static INTERRUPT_GEN(wpc_irq);

    const WPC_VBLANKDIV = 4;
    const WPC_IRQFREQ = 976;

    MDRV_CPU_VBLANK_INT(wpc_vblank, WPC_VBLANKDIV)
    MDRV_CPU_PERIODIC_INT(wpc_irq, WPC_IRQFREQ)


    / This is generated WPC_VBLANKDIV times per frame
    / = every 32/WPC_VBLANKDIV lines.
    / Generate a FIRQ if it matches the DMD line
    / Also do the smoothing of the solenoids and lamps

    wpclocals.vblankCount = (wpclocals.vblankCount+1) % 16;
    /-- check if the DMD line matches the requested interrupt line
    if ((wpclocals.vblankCount % WPC_VBLANKDIV) == (wpc_data[DMD_FIRQLINE]*WPC_VBLANKDIV/32))
      wpc_firq(TRUE, WPC_FIRQ_DMD);
    if ((wpclocals.vblankCount % WPC_VBLANKDIV) == 0) {
      /*-- This is the real VBLANK interrupt --
      dmdlocals.DMDFrames[dmdlocals.nextDMDFrame] = memory_region(WPC_DMDREGION)+ (wpc_data[DMD_VISIBLEPAGE] & 0x0f) * 0x200;

*/
  }

  executeCycle() {
    // CPU is clocked 2MHZ, 2'000'000 ticks / s
    CPU6809.steps(this.ticksToRun);
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

function initVMwithRom(romPath) {
  debug('initVM', romPath);
  return romloader.loadRom(romPath)
    .then((romObject) => {
      debug('loading rom succesfull');
      return new Wpc(romObject);
    });
}
