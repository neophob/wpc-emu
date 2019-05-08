'use strict';

const path = require('path');
const fs = require('fs');
const debug = require('debug')('wpcemu:benchmark');
const Emulator = require('../../lib/emulator');

const romU06Path = process.env.ROMFILE || path.join(__dirname, '/../../rom.freewpc/ft20_32.rom');

debug('roms', { romU06Path });

const CYCLE_COUNT = process.env.CYCLES || 2000000 * 5;

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

  return loadFile(romU06Path)
    .then((u06Rom) => {
      const romData = {
        u06: u06Rom,
      };
      const metaData = {
        features: ['wpcDmd'], //'securityPic', 'wpc95', 'wpcFliptronics', 'wpcDmd', 'wpcSecure'
        fileName: 'unittest',
        skipWpcRomCheck: false,
      };
      return Emulator.initVMwithRom(romData, metaData);
    })
    .then((wpcSystem) => {
      wpcSystem.start();
      const tsStart = Date.now();
      const ticksExecuted = wpcSystem.executeCycle(CYCLE_COUNT, tickSteps);
      const durationMs = Date.now() - tsStart;
      const status = wpcSystem.getUiState();
      const watchdogExpired = status.asic.wpc.watchdogExpiredCounter;
      console.error(`  ${tickSteps}\t\t${durationMs}\t\t${status.cpuState.missedIRQ}\t\t${status.cpuState.missedFIRQ}\t\t${ticksExecuted}\t\t${watchdogExpired}`);
    });
}

const HZ = 2000000;
const cpuRealTime = 1 / HZ * CYCLE_COUNT * 1000;
console.error(`BENCHMARK START, ROM: ${romU06Path}`);
console.error(`Ticks to execute: ${CYCLE_COUNT} => CPU REALTIME: ${cpuRealTime}ms (CPU HZ: ${HZ})`);
console.error('  tickSteps\tdurationMs\tmissed IRQ\tmissed FIRQ\tticksExecuted\twatchDogExpired');

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
  .then(() => benchmarkWithCycleCount(32768))
  .then(() => benchmarkWithCycleCount(65536));
