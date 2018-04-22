'use strict';

const debug = require('debug')('wpcemu');
const romloader = require('./romloader');
const CPU6809 = require('./cpu6809');
const WpcAsic = require('./wpcasic');

module.exports = {
  initVMwithRom
};

class Wpc {
  constructor(romObject) {
    const interruptCallback = {
      irq: CPU6809.irq,
      firq: CPU6809.firq,
      nmi: CPU6809.nmi,
    };
    this.asic = new WpcAsic(romObject, interruptCallback);
  }

  start() {
    debug('start WPC');
    const readMemory = this.asic.read8.bind(this.asic);
    const writeMemory = this.asic.write8.bind(this.asic);
    CPU6809.init(writeMemory, readMemory);
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
    CPU6809.steps(1024 * 64 * 256);
//    debug('cpu: %o', CPU6809.status());
    debug('cpu: %o', CPU6809.T());
/*    const currentCpuCycles = this.cpu.cycles;
    const expectedCpuCycles = currentCpuCycles + NTSC_CYCLES_PER_INTERVAL;
    while (this.cpu.cycles < expectedCpuCycles) {
      this.cpu.executeCycle();
    }
    // NTSC clocks runs 3 times faster than cpu
    let ppuTicksToRun = 3 * (this.cpu.cycles - currentCpuCycles);
    while (ppuTicksToRun--) {
      this.ppu.executeCycle();
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
