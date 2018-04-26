'use strict';

import test from 'ava';
import CPU6809 from '../../lib/cpu6809';

/*jshint bitwise: false*/

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

test.serial('flags should be correct after calling irq(), init flags to 0x00', t => {
  CPU6809.set('flags', 0x00);
  CPU6809.irq();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'EfhInzvc');
  t.is(readMemoryAddress[2], 0xFFF8);
  t.is(readMemoryAddress[3], 0xFFF9);
});

test.serial('flags should be correct after calling irq(), init flags to 0xef', t => {
  const flagClearedFirqBit = 0xff & ~16;
  CPU6809.set('flags', flagClearedFirqBit);
  CPU6809.irq();
  CPU6809.steps();
  t.is(readMemoryAddress[2], 0xFFF8);
  t.is(readMemoryAddress[3], 0xFFF9);
  t.is(CPU6809.flagsToString(), 'EFHINZVC');
});

test.serial('irq() should not be called if F_IRQMASK flag is set', t => {
  CPU6809.set('flags', 0xff);
  CPU6809.irq();
  CPU6809.steps();
  t.is(readMemoryAddress[2], NaN);
  t.is(readMemoryAddress[3], undefined);
});

test.serial('flags should be correct after calling nmi()', t => {
  CPU6809.set('flags', 0x00);
  CPU6809.nmi();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'EFhInzvc');
  t.is(readMemoryAddress[2], 0xFFFC);
  t.is(readMemoryAddress[3], 0xFFFD);
});

test.serial('flags should be correct after calling firq(), init flags to 0x00', t => {
  CPU6809.set('flags', 0x00);
  CPU6809.firq();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'eFhInzvc');
  t.is(readMemoryAddress[2], 0xFFF6);
  t.is(readMemoryAddress[3], 0xFFF7);
});

test.serial('flags should be correct after calling firq(), init flags to 0xbf', t => {
  const flagClearedFirqBit = 0xff & ~64;
  CPU6809.set('flags', flagClearedFirqBit);
  CPU6809.firq();
  CPU6809.steps();
  t.is(readMemoryAddress[2], 0xFFF6);
  t.is(readMemoryAddress[3], 0xFFF7);
  t.is(CPU6809.flagsToString(), 'eFHINZVC');
});

test.serial('firq() should not be called if F_FIRQMASK flag is set', t => {
  CPU6809.set('flags', 0xff);
  CPU6809.firq();
  CPU6809.steps();
  t.is(readMemoryAddress[2], NaN);
  t.is(readMemoryAddress[3], undefined);
});

test.serial('oNEG() should set CARRY flag correctly', t => {
  CPU6809.set('flags', 0xff);
  CPU6809.firq();
  CPU6809.steps();
  t.is(readMemoryAddress[2], NaN);
  t.is(readMemoryAddress[3], undefined);
});

//F_CARRY
//NEG DP
//0x40
//0x50
//0x60: //NEG indexed
//0x70: //NEG extended
