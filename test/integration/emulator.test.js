'use strict';

import path from 'path';
import fs from 'fs';
import test from 'ava';
import Emulator from '../../lib/emulator';

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
  const U14 = path.join(__dirname, '/../../rom.freewpc/U14.PP');
  const U15 = path.join(__dirname, '/../../rom.freewpc/U15.PP');
  const U18 = path.join(__dirname, '/../../rom.freewpc/U18.PP');

  return Promise.all([
    loadFile(ROMFILE),
    loadFile(U14),
    loadFile(U15),
    loadFile(U18),
  ])
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
      t.context = wpcSystem;
    });
});

test.serial('Smoketest, run emulator with rom ft20_32.rom', (t) => {
  const wpcSystem = t.context;
  wpcSystem.start();

  for (let i = 0; i < 0xFFFF; i++) {
    wpcSystem.executeCycle();
  }

  const uiState = wpcSystem.getUiState();
  t.is(uiState.asic.dmd.scanline, 22);
  t.deepEqual(uiState.asic.dmd.dmdPageMapping, [ 2, 3, 0, 0, 0, 0 ]);
  t.is(uiState.asic.dmd.activepage, 2);
  t.is(uiState.asic.wpc.activeRomBank, 24);
  t.is(uiState.asic.wpc.diagnosticLedToggleCount, 217);
  console.log('ticks', uiState.cpuState.tickCount);
  const ticksInRange = uiState.cpuState.tickCount > 3300000 && uiState.cpuState.tickCount < 34000000;
  t.is(ticksInRange, true);

  wpcSystem.executeCycle();
  wpcSystem.getUiState();
});

test.serial('steps(100) should execute at least 100 steps', (t) => {
  const wpcSystem = t.context;
  wpcSystem.start();
  const executetAtLeast100Cycles = wpcSystem.executeCycle(100) >= 100;
  t.is(executetAtLeast100Cycles, true);
});
