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
  const OP_ADDA = 0x8B;
  const ADD_VALUE_1 = 0xFF;
  const ADD_VALUE_2 = 0xFF;
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

test('oROL', (t) => {
  const OP_ROL = 0x49;
  const ADD_VALUE_1 = 0xFF;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_ROL, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 254);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvC');
});

test('oROR', (t) => {
  const OP_ROR = 0x46;
  const ADD_VALUE_1 = 0xFF;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_ROR, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 0x7F);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzvC');
});

test('oASL, overflow', (t) => {
  const OP_ASL = 0x48;
  const ADD_VALUE_1 = 0x81;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_ASL, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 2);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzVC');
});

test('oASL, no overflow', (t) => {
  const OP_ASL = 0x48;
  const ADD_VALUE_1 = 1;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_ASL, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 2);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzvc');
});

test('oNEG, 0x1', (t) => {
  const OP_NEG = 0x40;
  const ADD_VALUE_1 = 1;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_NEG, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 0xFF);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvC');
});

test('oNEG, 0xFF', (t) => {
  const OP_NEG = 0x40;
  const ADD_VALUE_1 = 0x1;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_NEG, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 0xFF);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvC');
});

test('oDEC, 0x80 (no overflow)', (t) => {
  const OP_DEC = 0x4A;
  const ADD_VALUE_1 = 0x80;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_DEC, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 0x7F);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzVc');
});

test('oDEC, 0x0 (overflow)', (t) => {
  const OP_DEC = 0x4A;
  const ADD_VALUE_1 = 0x0;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_DEC, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 0xFF);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvc');
});

test('oINC, 0x00 (no overflow)', (t) => {
  const OP_INC = 0x4C;
  const VALUE = 0x00;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_INC, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = VALUE;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 0x01);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzvc');
});

test('oINC, 0xFF (overflow)', (t) => {
  const OP_INC = 0x4C;
  const VALUE = 0xFF;
  const cpu = t.context;
  // add command in reverse order
  readMemoryAddress = [ OP_INC, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = VALUE;
  cpu.step();

  t.deepEqual(readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO ]);
  t.is(cpu.regA, 0x00);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInZvc');
});

test('PUSHB should wrap around', (t) => {
  const cpu = t.context;
  cpu.reset();
  cpu.PUSHB(0x23);
  t.deepEqual(writeMemoryAddress, [{ address: 65535, value: 0x23 }]);
});

test('PUSHW should wrap around', (t) => {
  const cpu = t.context;
  cpu.reset();
  cpu.PUSHW(0x1234);
  t.deepEqual(writeMemoryAddress, [{ address: 65535, value: 0x34 }, { address: 65534, value: 0x12 }]);
});

test('PUSHBU should wrap around', (t) => {
  const cpu = t.context;
  cpu.reset();
  cpu.PUSHBU(0x23);
  t.deepEqual(writeMemoryAddress, [{ address: 65535, value: 0x23 }]);
});

test('PUSHWU should wrap around', (t) => {
  const cpu = t.context;
  cpu.reset();
  cpu.PUSHWU(0x1234);
  t.deepEqual(writeMemoryAddress, [{ address: 65535, value: 0x34 }, { address: 65534, value: 0x12 }]);
});
