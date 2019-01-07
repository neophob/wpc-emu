'use strict';

import test from 'ava';
import Cpu6809 from '../../../../lib/boards/up/cpu6809';

test.beforeEach((t) => {
  const readMemoryAddress = [];
  const writeMemoryAddress = [];
  const readMemoryMock = (address) => {
    readMemoryAddress.push(address);
  };
  const writeMemoryMock = (address, value) => {
    writeMemoryAddress.push({ address, value });
  };
  const cpu = Cpu6809.getInstance(writeMemoryMock, readMemoryMock, 'UNITTEST');
  cpu.reset();
  t.context = cpu;
  t.context.readMemoryAddress = readMemoryAddress;
  t.context.writeMemoryAddress = writeMemoryAddress;
});

test('read initial vector', (t) => {
  t.is(t.context.readMemoryAddress[0], 0xFFFE);
  t.is(t.context.readMemoryAddress[1], 0xFFFF);
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
  cpu.fetch = () => 0x12;
  cpu.steps();
  t.is(cpu.flagsToString(), 'EfhInzvc');
  t.is(t.context.readMemoryAddress[2], 0xFFF8);
  t.is(t.context.readMemoryAddress[3], 0xFFF9);
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
  cpu.fetch = () => 0x12;
  cpu.steps();
  t.is(t.context.readMemoryAddress[2], 0xFFF8);
  t.is(t.context.readMemoryAddress[3], 0xFFF9);
  t.is(cpu.flagsToString(), 'EFHINZVC');
});

test('irq() should not be called if F_IRQMASK flag is set', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0xFF);
  cpu.irq();
  cpu.fetch = () => 0x12;
  cpu.steps();
  t.is(t.context.readMemoryAddress[2], undefined);
  t.is(t.context.readMemoryAddress[3], undefined);
});

test('flags should be correct after calling nmi()', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.nmi();
  cpu.fetch = () => 0x12;
  cpu.steps();
  t.is(cpu.flagsToString(), 'EFhInzvc');
  t.is(t.context.readMemoryAddress[2], 0xFFFC);
  t.is(t.context.readMemoryAddress[3], 0xFFFD);
});

test('flags should be correct after calling firq(), init flags to 0x00', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.firq();
  t.is(cpu.irqPendingFIRQ, true);
  cpu.fetch = () => 0x12;
  cpu.steps();
  t.is(cpu.flagsToString(), 'eFhInzvc');
  t.is(t.context.readMemoryAddress[2], 0xFFF6);
  t.is(t.context.readMemoryAddress[3], 0xFFF7);
});

test('flags should be correct after calling firq(), init flags to 0xbf', (t) => {
  const cpu = t.context;
  const flagClearedFirqBit = 0xFF & ~64;
  cpu.set('flags', flagClearedFirqBit);
  cpu.firq();
  cpu.fetch = () => 0x12;
  cpu.steps();
  t.is(t.context.readMemoryAddress[2], 0xFFF6);
  t.is(t.context.readMemoryAddress[3], 0xFFF7);
  t.is(cpu.flagsToString(), 'eFHINZVC');
});

test('firq() should not be called if F_FIRQMASK flag is set', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0xFF);
  cpu.firq();
  cpu.fetch = () => 0x12;
  cpu.steps();
  t.is(t.context.readMemoryAddress[2], undefined);
  t.is(t.context.readMemoryAddress[3], undefined);
});

test('oNEG() should set CARRY flag correctly', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0xFF);
  cpu.firq();
  cpu.fetch = () => 0x12;
  cpu.steps();
  t.is(t.context.readMemoryAddress[2], undefined);
  t.is(t.context.readMemoryAddress[3], undefined);
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

test('signed 5bit', (t) => {
  const cpu = t.context;
  const val0 = cpu.signed5bit(0);
  const valF = cpu.signed5bit(0xF);
  const val10 = cpu.signed5bit(0x10);
  const val1F = cpu.signed5bit(0x1F);
  const valUndef = cpu.signed5bit();
  t.is(val0, 0);
  t.is(valF, 15);
  t.is(val10, -16);
  t.is(val1F, -1);
  t.is(valUndef, undefined);
});

test('signed 8bit', (t) => {
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

test('signed 16bit', (t) => {
  const cpu = t.context;
  const val0 = cpu.signed16(0);
  const val7fff = cpu.signed16(0x7FFF);
  const val8000 = cpu.signed16(0x8000);
  const valffff = cpu.signed16(0xFFFF);
  const valUndef = cpu.signed16();
  t.is(val0, 0);
  t.is(val7fff, 32767);
  t.is(val8000, -32768);
  t.is(valffff, -1);
  t.is(valUndef, undefined);
});

test('flagsNZ16 0xFFFF', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  cpu.flagsNZ16(0xFFFF);
  t.is(cpu.flagsToString(), 'efhiNzvc');
});

test('flagsNZ16 0x0000', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  cpu.flagsNZ16(0);
  t.is(cpu.flagsToString(), 'efhinZvc');
});

test('WriteWord(0, 0x1234', (t) => {
  const cpu = t.context;
  cpu.WriteWord(0, 0x1234);
  t.deepEqual(t.context.writeMemoryAddress, [
    { address: 0, value: 0x12 },
    { address: 1, value: 0x34 },
  ]);
});

test('WriteWord(0xFFFF, 0x1234', (t) => {
  const cpu = t.context;
  cpu.WriteWord(0xFFFF, 0x1234);
  t.deepEqual(t.context.writeMemoryAddress, [
    { address: 0xFFFF, value: 0x12 },
    { address: 0, value: 0x34 },
  ]);
});

test('getD', (t) => {
  const cpu = t.context;
  cpu.regA = 0xFF;
  cpu.regB = 0xEE;
  const result = cpu.getD();
  t.is(result, 0xFFEE);
});

test('setD(0xFFEE)', (t) => {
  const cpu = t.context;
  cpu.setD('0xFFEE');
  t.is(cpu.regA, 0xFF);
  t.is(cpu.regB, 0xEE);
});

test('dpadd(), regDP = 0', (t) => {
  const cpu = t.context;
  cpu.regDP = 0;
  cpu.fetch = () => 0xFF;
  const result = cpu.dpadd();
  t.is(result, 0xFF);
});

test('dpadd(), regDP = 0xFF', (t) => {
  const cpu = t.context;
  cpu.regDP = 0xFF;
  cpu.fetch = () => 0xFF;
  const result = cpu.dpadd();
  t.is(result, 0xFFFF);
});

test('oNEG(0)', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  const result = cpu.oNEG(0);
  t.is(result, 0);
  t.is(cpu.flagsToString(), 'efhinZvc');
});

test('oNEG(1)', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  const result = cpu.oNEG(1);
  t.is(result, 0xFF);
  t.is(cpu.flagsToString(), 'efhiNzvC');
});

test('oNEG(0x7F)', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  const result = cpu.oNEG(0x7F);
  t.is(result, 0x81);
  t.is(cpu.flagsToString(), 'efhiNzvC');
});

test('oNEG(0x80)', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  const result = cpu.oNEG(0x80);
  t.is(result, 0x80);
  t.is(cpu.flagsToString(), 'efhiNzVC');
});

test('oNEG(0xFF)', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0);
  const result = cpu.oNEG(0xFF);
  t.is(result, 1);
  t.is(cpu.flagsToString(), 'efhinzvc');
});

test('setPostByteRegister(0, 0xFFFF)', (t) => {
  const cpu = t.context;
  cpu.setPostByteRegister(0, 0xFFFF);
  t.is(cpu.regA, 0xFF);
  t.is(cpu.regB, 0xFF);
});

test('setPostByteRegister(0x8, 0xFFFF)', (t) => {
  const cpu = t.context;
  cpu.setPostByteRegister(0x8, 0xFFFF);
  t.is(cpu.regA, 0xFF);
});

test('getPostByteRegister(0x0) - D', (t) => {
  const cpu = t.context;
  cpu.regA = 0x44;
  cpu.regB = 0x99;
  const result = cpu.getPostByteRegister(0x0);
  t.is(result, 0x4499);
});

test('getPostByteRegister(0x5) - PC', (t) => {
  const cpu = t.context;
  cpu.regPC = 0x1234;
  const result = cpu.getPostByteRegister(0x5);
  t.is(result, 0x1234);
});

test('getPostByteRegister(0xA) - CC', (t) => {
  const cpu = t.context;
  cpu.regCC = 0xFF;
  const result = cpu.getPostByteRegister(0xA);
  t.is(result, 0xFF);
});

test('TFREXG - transfer X -> Y', (t) => {
  const cpu = t.context;
  cpu.regX = 0xFFFF;
  cpu.regY = 0x7F;
  cpu.TFREXG(0x12, false);
  t.is(cpu.regX, 0xFFFF);
  t.is(cpu.regY, 0xFFFF);
});

test('TFREXG - exchange U <-> S', (t) => {
  const cpu = t.context;
  cpu.regU = 0xFFFF;
  cpu.regS = 0x7F;
  cpu.TFREXG(0x34, true);
  t.is(cpu.regU, 0x7F);
  t.is(cpu.regS, 0xFFFF);
});

test('TFREXG - transfer A -> CC', (t) => {
  const cpu = t.context;
  cpu.regA = 0xFF;
  cpu.regCC = 0x7F;
  cpu.TFREXG(0x8A, false);
  t.is(cpu.regA, 0xFF);
  t.is(cpu.regCC, 0xFF);
});

test('TFREXG - exchange b <-> DP', (t) => {
  const cpu = t.context;
  cpu.regB = 0xFF;
  cpu.regDP = 0x7F;
  cpu.TFREXG(0x9B, true);
  t.is(cpu.regB, 0x7F);
  t.is(cpu.regDP, 0xFF);
});
