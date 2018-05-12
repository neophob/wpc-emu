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
  return loadFile(ROMFILE)
    .then((rom) => {
      return Emulator.initVMwithRom(rom, 'unittest');
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
  t.is(uiState.ticks, 34952730);
  t.is(uiState.asic.dmd.scanline, 8);
  t.is(uiState.asic.dmd.lowpage, 2);
  t.is(uiState.asic.dmd.highpage, 3);
  t.is(uiState.asic.dmd.activepage, 2);
  t.is(uiState.asic.wpc.activeRomBank, 23);
  t.is(uiState.asic.wpc.diagnosticLedToggleCount, 24);
});

test.serial('steps(100) should execute at least 100 steps', (t) => {
  const wpcSystem = t.context;
  wpcSystem.start();
  const executetAtLeast100Cycles = wpcSystem.executeCycle(100) >= 100;
  t.is(executetAtLeast100Cycles, true);
});
