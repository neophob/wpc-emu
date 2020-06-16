'use strict';

const path = require('path');
const fs = require('fs');
const test = require('ava');
const Emulator = require('../../lib/emulator');

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

test.beforeEach((t) => {
  const ROMFILE = path.join(__dirname, '/../../rom.freewpc/ft20_32.rom');

  return loadFile(ROMFILE)
    .then((u06Rom) => {
      const romData = {
        u06: u06Rom,
      };
      return Emulator.initVMwithRom(romData, 'unittest');
    })
    .then((wpcSystem) => {
      t.context = wpcSystem;
    });
});

test.serial('Smoketest, run emulator with rom ft20_32.rom', (t) => {
  const wpcSystem = t.context;
  const soundPlayback = [];
  wpcSystem.registerAudioConsumer((id) => {
    soundPlayback.push(id);
  });
  wpcSystem.start();

  for (let i = 0; i < 0xFFFF; i++) {
    wpcSystem.executeCycle();
  }

  const uiState = wpcSystem.getUiState();
  t.is(uiState.asic.dmd.scanline, 11);
  t.deepEqual(uiState.asic.dmd.dmdPageMapping, [ 2, 3, 0, 0, 0, 0 ]);
  t.is(uiState.asic.dmd.activepage, 2);
  t.is(uiState.asic.wpc.activeRomBank, 24);
  t.is(uiState.asic.wpc.diagnosticLedToggleCount, 232);
  console.log('ticks', uiState.cpuState.tickCount);
  const ticksInRange = uiState.cpuState.tickCount > 3300000 && uiState.cpuState.tickCount < 34000000;
  t.is(ticksInRange, true);
  console.log('soundPlayback',soundPlayback);
  t.deepEqual(soundPlayback, [
    { command: 'STOPSOUND' },
    { command: 'STOPSOUND' },
    { command: 'PLAYSAMPLE', id: 30984 },
    { command: 'PLAYSAMPLE', id: 63232 },
    { command: 'PLAYSAMPLE', id: 30984 },
  ]);
});

test.serial('steps(100) should execute at least 100 steps', (t) => {
  const wpcSystem = t.context;
  wpcSystem.start();
  const executetAtLeast100Cycles = wpcSystem.executeCycle(100) >= 100;
  t.is(executetAtLeast100Cycles, true);
});
