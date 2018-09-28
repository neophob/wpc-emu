'use strict';

const Mc6809 = require('./mc6809');

module.exports = {
  getInstance
};

function getInstance(memoryWriteFunction, memoryReadFunction) {
  return new Cpu6809(memoryWriteFunction, memoryReadFunction);
}

class Cpu6809 {
  constructor(memoryWriteFunction, memoryReadFunction) {
    this.cpu = Mc6809.getInstance(memoryWriteFunction, memoryReadFunction);
    this.tickCount = 0;
  }

  reset() {
    this.cpu.setStackAddress(0);
    this.cpu.reset();
  }

  status() {
    return this.cpu.status();
  }

  steps(tickSteps) {
    const executedCycles = this.cpu.execute(tickSteps);
    this.tickCount = this.cpu.tickCount;
    return executedCycles;
  }

  irq() {
    //console.log('call irq')
    this.cpu.irq();
  }

  firq() {
    this.cpu.firq();
  }

  clearIrqMasking() {
    //console.log('clearIrqMasking')
    this.cpu.clearIrqMasking();
  }

  clearFirqMasking() {
    this.cpu.clearFirqMasking();
  }

}
