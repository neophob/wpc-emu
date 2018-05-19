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
  const cpu = Cpu6809.getInstance(writeMemoryMock, readMemoryMock);
  cpu.reset();
  t.context = cpu;
});

test('read initial vector', (t) => {
  t.is(readMemoryAddress[0], 0xFFFE);
  t.is(readMemoryAddress[1], 0xFFFF);
});

test('flags should be correct after calling irq(), init flags to 0x00', (t) => {
  const cpu = t.context;
  cpu.set('flags', 0x00);
  cpu.irq();
  cpu.steps();
  t.is(cpu.flagsToString(), 'EfhInzvc');
  t.is(readMemoryAddress[2], 0xFFF8);
  t.is(readMemoryAddress[3], 0xFFF9);
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
