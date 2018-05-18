'use strict';

const path = require('path');
const fs = require('fs');
const Emulator = require('../../lib/emulator');

const romU06Path = process.env.ROMFILE || path.join(__dirname, '/../../rom.freewpc/ft20_32.rom');
const romU14Path = process.argv[3] || 'rom/U14.PP';
const romU15Path = process.argv[4] || 'rom/U15.PP';
const romU18Path = process.argv[5] || 'rom/U18.PP';

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

  const loadRomFilesPromise = Promise.all([
    loadFile(romU06Path),
    loadFile(romU14Path),
    loadFile(romU15Path),
    loadFile(romU18Path),
  ]);

  return loadRomFilesPromise
    .then((romFiles) => {
      const romData = {
        u06: romFiles[0],
        u14: romFiles[1],
        u15: romFiles[2],
        u18: romFiles[3],
      };
      return Emulator.initVMwithRom(romData, 'unittest');
    })
    .then((wpcSystem) => {
      wpcSystem.start();
      const tsStart = Date.now();
      const ticksExecuted = wpcSystem.executeCycle(CYCLE_COUNT, tickSteps);
      const durationMs = Date.now() - tsStart;
      const status = wpcSystem.getUiState();
      console.error(`  ${tickSteps}\t\t${durationMs}\t\t${status.missedIrqCall}\t\t${status.missedFirqCall}\t\t${ticksExecuted}`);
    });
}

const HZ = 2000000;
const cpuRealTime = 1 / HZ * CYCLE_COUNT * 1000;
console.error(`BENCHMARK START, ROM: ${ROMFILE}`);
console.error(`Ticks to execute: ${CYCLE_COUNT} => CPU REALTIME: ${cpuRealTime}ms (CPU HZ: ${HZ})`);
console.error('  tickSteps\tdurationMs\tmissed IRQ\tmissed FIRQ\tticksExecuted');

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
  .then(() => benchmarkWithCycleCount(16384));
