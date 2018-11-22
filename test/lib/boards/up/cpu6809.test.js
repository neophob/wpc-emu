'use strict';

import test from 'ava';
import Cpu6809 from '../../../../lib/boards/up/cpu6809';

/*jshint bitwise: false*/

let readMemoryAddress;
let writeMemoryAddress;
test.beforeEach((t) => {
  readMemoryAddress = [];
  writeMemoryAddress = [];
  const readMemoryMock = (address) => {
    readMemoryAddress.push(address);
  };
  const writeMemoryMock = (address) => {
    writeMemoryAddress.push(address);
  };
  const cpu = Cpu6809.getInstance(writeMemoryMock, readMemoryMock, 'UNITTEST');
  cpu.reset();
  t.context = cpu;
});

test('read initial vector', (t) => {
  t.is(readMemoryAddress[0], 0xFFFE);
  t.is(readMemoryAddress[1], 0xFFFF);
});

test('oCMP 8bit, carry flag', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP(0, 0xFF);
  t.is(cpu.flagsToString(), 'efhinzvC');
});

test('oCMP 8bit, 0xFF', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP(0xFF, 0);
  t.is(cpu.flagsToString(), 'efhiNzvc');
});

test('oCMP 8bit, negative flag', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP(0, 0x80);
  t.is(cpu.flagsToString(), 'efhiNzVC');
});


test('oCMP 8bit, -1', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP(0, 1);
  t.is(cpu.flagsToString(), 'efhiNzvC');
});

test('oCMP 8bit, zero flag', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP(0, 0);
  t.is(cpu.flagsToString(), 'efhinZvc');
});

test('oCMP 16bit, carry flag', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP16(0, 0xFFFF);
  t.is(cpu.flagsToString(), 'efhinzvC');
});

test('oCMP 16bit, 0xFFFF', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP16(0xFFFF, 0);
  t.is(cpu.flagsToString(), 'efhiNzvc');
});

test('oCMP 16bit, negative flag', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP16(0, 0x8000);
  t.is(cpu.flagsToString(), 'efhiNzVC');
});

test('oCMP 16bit, -1', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP16(0, 1);
  t.is(cpu.flagsToString(), 'efhiNzvC');
});

test('oCMP 16bit, zero flag', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.oCMP16(0, 0);
  t.is(cpu.flagsToString(), 'efhinZvc');
});

test('flags should be correct after calling irq(), init flags to 0x00', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.irq();
  t.is(cpu.irqPendingIRQ, true);
  cpu.steps();
  t.is(cpu.flagsToString(), 'EfhInzvc');
  t.is(readMemoryAddress[2], 0xFFF8);
  t.is(readMemoryAddress[3], 0xFFF9);
  t.is(cpu.irqPendingIRQ, false);
});

test('clear irq mask should set pending irq to false', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.irq();
  cpu.clearIrqMasking();
  t.is(cpu.flagsToString(), 'efhinzvc');
  t.is(cpu.irqPendingIRQ, false);
});

test('clear firq mask should set pending irq to false', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.firq();
  cpu.clearFirqMasking();
  t.is(cpu.flagsToString(), 'efhinzvc');
  t.is(cpu.irqPendingFIRQ, false);
});

test('flags should be correct after calling irq(), init flags to 0xef', (t) => {
  const cpu = t.context;
  const flagClearedFirqBit = 0xFF & ~16;
  cpu.set('flags', flagClearedFirqBit);
  cpu.irq();
  cpu.steps();
  t.is(readMemoryAddress[2], 0xFFF8);
  t.is(readMemoryAddress[3], 0xFFF9);
  t.is(cpu.flagsToString(), 'EFHINZVC');
});

test('irq() should not be called if F_IRQMASK flag is set', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0xFF);
  cpu.irq();
  cpu.steps();
  t.is(readMemoryAddress[2], NaN);
  t.is(readMemoryAddress[3], undefined);
});

test('flags should be correct after calling nmi()', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.nmi();
  cpu.steps();
  t.is(cpu.flagsToString(), 'EFhInzvc');
  t.is(readMemoryAddress[2], 0xFFFC);
  t.is(readMemoryAddress[3], 0xFFFD);
});

test('flags should be correct after calling firq(), init flags to 0x00', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.firq();
  t.is(cpu.irqPendingFIRQ, true);
  cpu.steps();
  t.is(cpu.flagsToString(), 'eFhInzvc');
  t.is(readMemoryAddress[2], 0xFFF6);
  t.is(readMemoryAddress[3], 0xFFF7);
});

test('flags should be correct after calling firq(), init flags to 0xbf', (t) => {
  const cpu = t.context;
  const flagClearedFirqBit = 0xFF & ~64;
  cpu.set('flags', flagClearedFirqBit);
  cpu.firq();
  cpu.steps();
  t.is(readMemoryAddress[2], 0xFFF6);
  t.is(readMemoryAddress[3], 0xFFF7);
  t.is(cpu.flagsToString(), 'eFHINZVC');
});

test('firq() should not be called if F_FIRQMASK flag is set', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0xFF);
  cpu.firq();
  cpu.steps();
  t.is(readMemoryAddress[2], NaN);
  t.is(readMemoryAddress[3], undefined);
});

test('oNEG() should set CARRY flag correctly', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0xFF);
  cpu.firq();
  cpu.steps();
  t.is(readMemoryAddress[2], NaN);
  t.is(readMemoryAddress[3], undefined);
});

test('set overflow flag (8bit)', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  cpu.setV8(1, 1, 0x80);
  t.is(cpu.flagsToString(), 'efhinzVc');
});

test('set overflow flag (8bit), overflow r value', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  cpu.setV8(1, 1, 0x180);
  t.is(cpu.flagsToString(), 'efhinzvc');
});

test('set overflow flag (16bit)', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  cpu.setV16(1, 1, 0x8000);
  t.is(cpu.flagsToString(), 'efhinzVc');
});

test('set overflow flag (16bit), overflow r value', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  cpu.setV16(1, 1, 0x18000);
  t.is(cpu.flagsToString(), 'efhinzvc');
});

test('signed byte', (t) => {
  const cpu = t.context;
  const val0 = cpu.signed(0);
  const val7f = cpu.signed(0x7F);
  const val80 = cpu.signed(0x80);
  const valff = cpu.signed(0xFF);
  const valUndef = cpu.signed();
  t.is(val0, 0);
  t.is(val7f, 0x7F);
  t.is(val80, -128);
  t.is(valff, -1);
  t.is(valUndef, undefined);
});

test('signed word', (t) => {
  const cpu = t.context;
  const val0 = cpu.signed(0);
  const val7fff = cpu.signed(0x7FFF);
  const val8000 = cpu.signed(0x8000);
  const valffff = cpu.signed(0xFFFF);
  const valUndef = cpu.signed();
  t.is(val0, 0);
  t.is(val7fff, 0x7EFF);
  t.is(val8000, 32512);
  t.is(valffff, 65279);
  t.is(valUndef, undefined);
});
