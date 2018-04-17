'use strict';

const debug = require('debug')('wpcemu:wpc');
const romloader = require('./romloader');
const CPU6809 = require('./cpu6809');

module.exports = {
  initVMwithRom
};

class Wpc {
  constructor(romObject) {
    this.romSizeMBit = romObject.romSizeMBit;
    this.systemRom = romObject.systemRom;
    this.gameRom = romObject.gameRom;
  }

  start() {
    debug('start WPC');
    //CPU6809.init(memoryTo,memoryAt,ticker) - Initializes the whole system. All parameters are callback functions for port / memory access:
    //memoryTo(addr,value) - store byte to given address
    //memoryAt(addr) - read byte from given address
    const memoryTo = (addr,value) => {
      debug('set memory at %i to %i', addr,value);
    };
    const memoryAt = (addr) => {
      return this.systemRom[addr];
    };
    CPU6809.init(memoryTo, memoryAt);
  }

  executeCycle() {
    CPU6809.steps(1);
    debug('cpu:', CPU6809.status());
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
