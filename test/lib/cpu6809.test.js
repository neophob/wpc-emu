'use strict';

import test from 'ava';
import CPU6809 from '../../lib/cpu6809';

let readMemoryAddress, writeMemoryAddress;
test.beforeEach(() => {
  readMemoryAddress = [];
  writeMemoryAddress = [];
  const readMemoryMock = (address) => {
    readMemoryAddress.push(address);
  };
  const writeMemoryMock = (address) => {
    writeMemoryAddress.push(address);
  };
  CPU6809.init(writeMemoryMock, readMemoryMock);
  CPU6809.reset();
});

test.serial('read initial vector', t => {
  t.is(readMemoryAddress[0], 0xFFFE);
  t.is(readMemoryAddress[1], 0xFFFF);
});

test.serial('flags should be correct after calling irq()', t => {
  CPU6809.set('flags', 0);
  CPU6809.irq();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'EfhInzvc');
  t.is(readMemoryAddress[2], 0xFFF8);
  t.is(readMemoryAddress[3], 0xFFF9);
});

test.serial('flags should be correct after calling nmi()', t => {
  CPU6809.set('flags', 0);
  CPU6809.nmi();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'EFhInzvc');
  t.is(readMemoryAddress[2], 0xFFFC);
  t.is(readMemoryAddress[3], 0xFFFD);
});

test.serial('flags should be correct after calling firq(), init flags to 0x00', t => {
  CPU6809.set('flags', 0);
  CPU6809.firq();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'eFhInzvc');
  t.is(readMemoryAddress[2], 0xFFF6);
  t.is(readMemoryAddress[3], 0xFFF7);
});

test.serial('flags should be correct after calling firq(), init flags to 0xff', t => {
  CPU6809.set('flags', 0xff);
  CPU6809.firq();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'eFHINZVC');
});
