'use strict';

const test = require('ava');
const sinon = require('sinon');
const CpuBoardAsic = require('../../../lib/boards/asic');

let clock;
test.before(() => {
  clock = sinon.useFakeTimers(12345678);
});

test.after('cleanup', () => {
  clock.restore();
});

test.beforeEach((t) => {
  const ram = new Uint8Array(0x4000);
  const initObject = {
    interruptCallback: {},
    ram,
  };
  t.context = CpuBoardAsic.getInstance(initObject);
});

test('wpc, should set zerocross flag', (t) => {
  const wpc = t.context;
  wpc.setZeroCrossFlag();
  t.is(wpc.zeroCrossFlag, 1);
});

test('wpc, should clear zerocross flag when read', (t) => {
  const wpc = t.context;
  wpc.setZeroCrossFlag();
  const result = wpc.read(CpuBoardAsic.OP.WPC_ZEROCROSS_IRQ_CLEAR);
  t.is(result, 0x80);
  t.is(wpc.zeroCrossFlag, 0);
});

test('wpc, should respect old zerocross flag state when read', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_ZEROCROSS_IRQ_CLEAR, 0x7F);
  wpc.setZeroCrossFlag();
  const result = wpc.read(CpuBoardAsic.OP.WPC_ZEROCROSS_IRQ_CLEAR);
  t.is(result, 0xFF);
  t.is(wpc.zeroCrossFlag, 0);
});

test('wpc, should respect old zerocross flag state when read,xxx', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_ZEROCROSS_IRQ_CLEAR, 0x10);
  const result = wpc.read(CpuBoardAsic.OP.WPC_ZEROCROSS_IRQ_CLEAR);
  t.is(result, 0x10);
  t.is(wpc.zeroCrossFlag, 0);
});

test('wpc, should WPC_SHIFTADDRL by 0xFF', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTADDRL, 0x08);
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0xFF);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTADDRL);
  t.is(result, 0x27);
});

test('wpc, should WPC_SHIFTADDRL 0x00 by 0x80', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTADDRL, 0x00);
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0x80);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTADDRL);
  t.is(result, 0x10);
});

test('wpc, should WPC_SHIFTADDRL 0x00 by 0x40', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTADDRL, 0x00);
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0x40);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTADDRL);
  t.is(result, 0x08);
});

test('wpc, should WPC_SHIFTADDRL by 0x1 - not sure', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTADDRL, 0x08);
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0x1);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTADDRL);
  t.is(result, 0x08);
});

test('wpc, should WPC_SHIFTADDRH - not sure', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTADDRH, 0xA8);
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTADDRL, 0x08);
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0xFF);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTADDRH);
  t.is(result, 0xA8);
});

test('wpc, should WPC_SHIFTADDRH, max value', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTADDRH, 0xFF);
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTADDRL, 0xFF);
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0xFF);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTADDRH);
  t.is(result, 0x0);
});

test('wpc, should WPC_SHIFTBIT 0x00 (set bit 0)', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0x00);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTBIT);
  t.is(result, 0x01);
});

test('wpc, should WPC_SHIFTBIT 0x01 (set bit 1)', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0x01);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTBIT);
  t.is(result, 0x02);
});

test('wpc, should WPC_SHIFTBIT 0x04 (set bit 5)', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0x04);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTBIT);
  t.is(result, 0x10);
});

test('wpc, should WPC_SHIFTBIT 0x07 (set bit 7)', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0xFF);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTBIT);
  t.is(result, 0x80);
});

test('wpc, should WPC_SHIFTBIT2 0x07 (set bit 7)', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT2, 0xFF);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTBIT2);
  t.is(result, 0x80);
});

test('wpc, should WPC_SHIFTBIT 0xFF (set bit 7)', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_SHIFTBIT, 0xFF);
  const result = wpc.read(CpuBoardAsic.OP.WPC_SHIFTBIT);
  t.is(result, 0x80);
});

test('wpc, update active lamp', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_LAMP_ROW_OUTPUT, 0x4);
  wpc.write(CpuBoardAsic.OP.WPC_LAMP_COL_STROBE, 0x4);
  const result = wpc.getState().lampState;
  t.is(result[18], 0xFF);
});

test('wpc, get time, should update checksum', (t) => {
  const wpc = t.context;
  const hours = wpc.read(CpuBoardAsic.OP.WPC_CLK_HOURS_DAYS);
  //I don't know why, but travis is always a hour behind
  const is3or4Hour = hours === 4 || hours === 3;
  t.is(is3or4Hour, true);
  t.is(wpc.ram[0x1807], 255);
  t.is(wpc.ram[0x1808], 62);
});

test('wpc, write and read fliptronics', (t) => {
  const wpc = t.context;
  wpc.setFliptronicsInput('F4');
  const result = wpc.read(CpuBoardAsic.OP.WPC_FLIPTRONICS_FLIPPER_PORT_A);
  t.is(result, 247);
});

test('wpc, write and read wpc95 flipper', (t) => {
  const wpc = t.context;
  wpc.setFliptronicsInput('F2');
  const result = wpc.read(CpuBoardAsic.OP.WPC95_FLIPPER_SWITCH_INPUT);
  t.is(result, 253);
});

test('wpc, write and read WPC95_FLIPPER_COIL_OUTPUT', (t) => {
  const wpc = t.context;
  wpc.setFliptronicsInput('F1');
  const result = wpc.read(CpuBoardAsic.OP.WPC95_FLIPPER_COIL_OUTPUT);
  t.is(result, 254);
});

test('wpc, ignore empty setState', (t) => {
  const wpc = t.context;
  const result = wpc.setState();
  t.is(result, false);
});

test('wpc, getState / setState', (t) => {
  const wpc = t.context;
  wpc.romBank = 11;
  const state = wpc.getState();
  wpc.romBank = 2;
  wpc.setState(state);
  t.is(wpc.romBank, 11);
});

test('wpc, should reset blanking', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_ZEROCROSS_IRQ_CLEAR, 0x02);
  t.is(wpc.blankSignalHigh, false);
});

test('wpc, should NOT reset blanking', (t) => {
  const wpc = t.context;
  wpc.write(CpuBoardAsic.OP.WPC_ZEROCROSS_IRQ_CLEAR, 0x04);
  t.is(wpc.blankSignalHigh, true);
});
