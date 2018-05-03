'use strict';

import test from 'ava';
import fs from 'fs';
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

test('Smoketest, run emulator with rom ft20_32.rom', (t) => {
  const ROMFILE = __dirname + '/../../rom.freewpc/ft20_32.rom';
  return loadFile(ROMFILE)
    .then((rom) => {
      return Emulator.initVMwithRom(rom, 'unittest');
    })
    .then((wpcSystem) => {
      wpcSystem.start();
      for (let i = 0; i < 0xffff; i++) {
        wpcSystem.executeCycle();
      }
      const uiState = wpcSystem.getUiState();
      t.is(uiState.ticks, 33668362);
      t.is(uiState.asic.dmd.scanline, 31);
      t.is(uiState.asic.dmd.lowpage, 2);
      t.is(uiState.asic.dmd.highpage, 3);
      t.is(uiState.asic.dmd.activepage, 2);
      t.is(uiState.asic.wpc.activeRomBank, 27);
      t.is(uiState.asic.wpc.diagnosticLedToggleCount, 24);
    });
});
