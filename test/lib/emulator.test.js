'use strict';

import test from 'ava';
import Emulator from '../../lib/emulator';

const Package = require('../../package.json');

test('Emulator get version', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    const version = emulator.version();
    t.is(version, Package.version);
  });
});

test('Emulator toggle midnightModeEnabled', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    emulator.toggleMidnightMadnessMode();
    t.is(emulator.cpuBoard.asic.midnightModeEnabled, true);
  });
});

test('Emulator reset', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    emulator.reset();
    t.is(emulator.cpuBoard.ticksIrq, 0);
  });
});

test('Emulator toggle input', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    emulator.setCabinetInput(4);
    emulator.setInput(11);
    emulator.setFliptronicsInput('F3');
    const inputState = Array.from(emulator.getUiState().asic.wpc.inputState);
    t.deepEqual(inputState, [ 4, 1, 8, 0, 0, 0, 0, 0, 0, 4 ]);
  });
});

