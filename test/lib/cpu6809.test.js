'use strict';

import test from 'ava';
import CPU6809 from '../../lib/cpu6809';

test.beforeEach(() => {
  const readMemoryMock = () => {};
  const writeMemoryMock = () => {};
  CPU6809.init(readMemoryMock, writeMemoryMock);
});

test.serial('flags should be correct after calling irq()', t => {
  CPU6809.set('flags', 0);
  CPU6809.irq();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'EfhInzvc');
});

test.serial('flags should be correct after calling nmi()', t => {
  CPU6809.set('flags', 0);
  CPU6809.nmi();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'EFhInzvc');
});

test.serial('flags should be correct after calling firq(), init flags to 0x00', t => {
  CPU6809.set('flags', 0);
  CPU6809.firq();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'eFhInzvc');
});

test.serial('flags should be correct after calling firq(), init flags to 0xff', t => {
  CPU6809.set('flags', 0xff);
  CPU6809.firq();
  CPU6809.steps();
  t.is(CPU6809.flagsToString(), 'eFHINZVC');
});
