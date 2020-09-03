'use strict';

const test = require('ava');
const CpuBoard = require('../../../lib/boards/cpu-board');

const PAGESIZE = 0x4000;
const WPC_ROM_BANK = 0x3FFC;

test.beforeEach((t) => {
  const gameRom = new Uint8Array(0x18000).fill(0xFF);
  const initObject = {
    romObject: '',
    romSizeMBit: 1,
    systemRom: new Uint8Array(2 * PAGESIZE).fill(0xFF),
    fileName: 'foo',
    gameRom,
  };
  t.context = CpuBoard.getInstance(initObject);
});

test('should get ui data', (t) => {
  const cpuBoard = t.context;
  cpuBoard.reset();
  const result = cpuBoard.getState();
  t.is(result.cpuState.tickCount, 0);
  t.is(result.cpuState.missedIRQ, 0);
  t.is(result.cpuState.missedFIRQ, 0);
  t.is(result.cpuState.irqCount, 0);
  t.is(result.cpuState.firqCount, 0);
  t.is(result.cpuState.nmiCount, 0);
  t.is(result.protectedMemoryWriteAttempts, 0);
  t.is(result.memoryWrites, 0);
  t.is(result.version, 5);
});

test('should start cpu board', (t) => {
  const cpuBoard = t.context;
  cpuBoard.start();
  const result = cpuBoard.getState();
  t.is(result.cpuState.tickCount, 0);
});

test('should ignore empty setState', (t) => {
  const cpuBoard = t.context;
  cpuBoard.start();
  const result = cpuBoard.setState();
  t.is(result, false);
});

test('should ignore invalid version', (t) => {
  const cpuBoard = t.context;
  cpuBoard.start();
  const result = cpuBoard.setState({ version: 1 });
  t.is(result, false);
});

test('should change cabinet input', (t) => {
  const cpuBoard = t.context;
  cpuBoard.start();
  cpuBoard.setCabinetInput(1);
  const state = cpuBoard.getState();
  const result = state.asic.wpc.inputState;
  t.is(result[0], 1);
});

test('should change switch input', (t) => {
  const cpuBoard = t.context;
  cpuBoard.start();
  cpuBoard.setSwitchInput(11);
  cpuBoard.setSwitchInput(13);
  const state = cpuBoard.getState();
  const result = state.asic.wpc.inputState;
  t.is(result[1], 5);
});

test('should change fliptronice input', (t) => {
  const cpuBoard = t.context;
  cpuBoard.start();
  cpuBoard.setFliptronicsInput('F1');
  const state = cpuBoard.getState();
  const result = state.asic.wpc.inputState;
  t.is(result[9], 1);
});

test('should enable toggleMidnightMadnessMode', (t) => {
  const cpuBoard = t.context;
  cpuBoard.toggleMidnightMadnessMode();
  const state = cpuBoard.getState();
  const result = state.asic.wpc.time;
  t.regex(result, /MM!$/);
});

test('should _bankswitchedRead, bank 0', (t) => {
  const BANK = 0;
  const cpuBoard = t.context;
  cpuBoard.gameRom[0] = 12;
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard._bankswitchedRead(0);
  t.is(result, 12);
});

test('should _bankswitchedRead, bank 1', (t) => {
  const BANK = 1;
  const cpuBoard = t.context;
  cpuBoard.gameRom[PAGESIZE] = 12;
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard._bankswitchedRead(0);
  t.is(result, 12);
});

test('should _bankswitchedRead, bank 5', (t) => {
  const BANK = 5;
  const cpuBoard = t.context;
  cpuBoard.gameRom[5 * PAGESIZE] = 12;
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard._bankswitchedRead(0);
  t.is(result, 12);
});

test('should _bankswitchedRead, bank 6 (systemrom, out of band)', (t) => {
  const BANK = 6;
  const cpuBoard = t.context;
  // this read wraps already
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard._bankswitchedRead(0);
  t.is(result, 0);
});

test('should _bankswitchedRead, bank 8', (t) => {
  const BANK = 8;
  const cpuBoard = t.context;
  cpuBoard.gameRom[0] = 12;
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard._bankswitchedRead(0);
  t.is(result, 12);
});

test('should mirror wpc asic calls in memory', (t) => {
  const BANK = 6;
  const cpuBoard = t.context;
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard.ram[WPC_ROM_BANK];
  t.is(result, BANK);
});
