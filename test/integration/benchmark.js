'use strict';

const path = require('path');
const fs = require('fs');
const Emulator = require('../../lib/emulator');

const ROMFILE = process.env.ROMFILE || path.join(__dirname, '/../../rom.freewpc/ft20_32.rom');
const CYCLE_COUNT = process.env.CYCLES || 2000000;

function loadFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(new Uint8Array(data));
    });
  });
}

function benchmarkWithCycleCount(tickSteps) {
  return loadFile(ROMFILE)
    .then((rom) => {
      return Emulator.initVMwithRom(rom, 'unittest');
    })
    .then((wpcSystem) => {
      wpcSystem.start();
      const tsStart = Date.now();
      const ticksExecuted = wpcSystem.executeCycle(CYCLE_COUNT, tickSteps);
      const status = wpcSystem.getUiState();
      const durationMs = Date.now() - tsStart;
      console.error(`DURATION_MS_FOR_0xFFFF_CYCLES\t${durationMs}\t\t${tickSteps}\t\t${status.missedIrqCall}\t\t${status.missedFirqCall}\t\t${ticksExecuted}`);
    });
}

const HZ = 2000000;
const cpuRealTime = 1 / HZ * CYCLE_COUNT * 1000;
console.error(`BENCHMARK START, ROM: ${ROMFILE}`);
console.error(`Ticks to execute: ${CYCLE_COUNT} => CPU REALTIME: ${cpuRealTime}ms (CPU HZ: ${HZ})`);
console.error('                             \tdurationMs\ttickSteps\tmissed IRQ\tmissed FIRQ\tticksExecuted');

Promise.resolve()
  .then(() => benchmarkWithCycleCount(1))
  .then(() => benchmarkWithCycleCount(2))
  .then(() => benchmarkWithCycleCount(4))
  .then(() => benchmarkWithCycleCount(5))
  .then(() => benchmarkWithCycleCount(8))
  .then(() => benchmarkWithCycleCount(10))
  .then(() => benchmarkWithCycleCount(12))
  .then(() => benchmarkWithCycleCount(16))
  .then(() => benchmarkWithCycleCount(32))
  .then(() => benchmarkWithCycleCount(64))
  .then(() => benchmarkWithCycleCount(256))
  .then(() => benchmarkWithCycleCount(390))
  .then(() => benchmarkWithCycleCount(393))
  .then(() => benchmarkWithCycleCount(512))
  .then(() => benchmarkWithCycleCount(1024))
  .then(() => benchmarkWithCycleCount(2048))
  .then(() => benchmarkWithCycleCount(4096))
  .then(() => benchmarkWithCycleCount(8192))
  .then(() => benchmarkWithCycleCount(16384))
;
