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

test('Emulator toggle switch input', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    const inputState1 = Array.from(emulator.getState().asic.wpc.inputState);
    emulator.setSwitchInput(11);
    const inputState2 = Array.from(emulator.getState().asic.wpc.inputState);
    t.deepEqual(inputState1, [ 0, 0, 8, 0, 0, 0, 0, 0, 0, 0 ]);
    t.deepEqual(inputState2, [ 0, 1, 8, 0, 0, 0, 0, 0, 0, 0 ]);
  });
});

test('Emulator clear switch input', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    emulator.setSwitchInput(11, false);
    const inputState = Array.from(emulator.getState().asic.wpc.inputState);
    t.deepEqual(inputState, [ 0, 0, 8, 0, 0, 0, 0, 0, 0, 0 ]);
  });
});

test('Emulator set switch input', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    emulator.setSwitchInput(11, true);
    const inputState = Array.from(emulator.getState().asic.wpc.inputState);
    t.deepEqual(inputState, [ 0, 1, 8, 0, 0, 0, 0, 0, 0, 0 ]);
  });
});

test('Emulator get default dip switch state', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    const result = emulator.getDipSwitchByte();
    t.is(result, 0);
  });
});

test('Emulator set/get default dip switch state', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    emulator.setDipSwitchByte(222);
    const result = emulator.getDipSwitchByte();
    t.is(result, 222);
  });
});
