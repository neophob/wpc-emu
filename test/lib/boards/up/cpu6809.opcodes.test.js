'use strict';

import test from 'ava';
import Cpu6809 from '../../../../lib/boards/up/cpu6809';

/*jshint bitwise: false*/

const RESET_VECTOR_VALUE_LO = 0x01;
const RESET_VECTOR_VALUE_HI = 0x02;

const EXPECTED_RESET_READ_OFFSET_LO = 0x201;
const EXPECTED_RESET_READ_OFFSET_HI = 0x202;

const RESET_VECTOR_OFFSET_LO = 0xFFFE;
const RESET_VECTOR_OFFSET_HI = 0xFFFF;

let readMemoryAddressAccess;
let readMemoryAddress;
let writeMemoryAddress;
test.beforeEach((t) => {
  readMemoryAddressAccess = [];
  readMemoryAddress = [];
  writeMemoryAddress = [];
  const readMemoryMock = (address) => {
    readMemoryAddressAccess.push(address);
    return readMemoryAddress.pop();
  };
  const writeMemoryMock = (address, value) => {
    writeMemoryAddress.push({ address, value });
  };
  const cpu = Cpu6809.getInstance(writeMemoryMock, readMemoryMock);
  t.context = cpu;
});

test('should read RESET vector on boot', (t) => {
  const cpu = t.context;
  cpu.reset();
  t.deepEqual(readMemoryAddressAccess, 
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI ]);
});

test('ADDA / oADD', (t) => {
  const OP_ADDA = 0x8b;
  const ADD_VALUE_1 = 0xff;
  const ADD_VALUE_2 = 0xff;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ ADD_VALUE_2, OP_ADDA, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];
  
  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();
  
  t.deepEqual(readMemoryAddressAccess, 
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO, EXPECTED_RESET_READ_OFFSET_HI ]);
  t.is(cpu.regA, 254);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFHINzvC'); 
});

