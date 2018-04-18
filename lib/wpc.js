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
    this.asic = new WpcAsic(romObject);
  }

  start() {
    debug('start WPC');
    const readMemory = this.asic.read8.bind(this.asic);
    const writeMemory = this.asic.write8.bind(this.asic);
    CPU6809.init(writeMemory, readMemory);
  }

  executeCycle() {
    CPU6809.steps(1024 * 64);
//    debug('cpu: %o', CPU6809.status());
//    debug('cpu: %o', CPU6809.T());
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
