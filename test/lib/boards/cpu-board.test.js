'use strict';

import test from 'ava';
import CpuBoard from '../../../lib/boards/cpu-board';

const PAGESIZE = 0x4000;
const WPC_ROM_BANK = 0x3FFC;

test.beforeEach((t) => {
  const gameRom = new Uint8Array(0x18000);
  const initObject = {
    romObject: '',
    romSizeMBit: 1,
    systemRom: new Uint8Array(2 * PAGESIZE).fill(0xFF),
    fileName: 'foo',
    gameRom,
  };
  t.context = CpuBoard.getInstance(initObject);
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

test('should _bankswitchedRead, bank 6 (systemrom)', (t) => {
  const BANK = 6;
  const cpuBoard = t.context;
  // this read wraps already
  cpuBoard.systemRom[0] = 12;
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard._bankswitchedRead(0);
  t.is(result, 12);
});

test('should _bankswitchedRead, bank 7 (systemrom)', (t) => {
  const BANK = 7;
  const cpuBoard = t.context;
  cpuBoard.systemRom[PAGESIZE] = 12;
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard._bankswitchedRead(0);
  t.is(result, 12);
});

test('should _bankswitchedRead, bank 8', (t) => {
  const BANK = 8;
  const cpuBoard = t.context;
  cpuBoard.gameRom[0] = 12;
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard._bankswitchedRead(0);
  t.is(result, 12);
});

test('should _bankswitchedRead, bank 0xFF (systemrom)', (t) => {
  const BANK = 0xFF;
  const cpuBoard = t.context;
  cpuBoard.systemRom[PAGESIZE] = 12;
  cpuBoard.asic.write(WPC_ROM_BANK, BANK);
  const result = cpuBoard._bankswitchedRead(0);
  t.is(result, 12);
});
