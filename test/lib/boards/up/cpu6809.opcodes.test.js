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

test.beforeEach((t) => {

  const readMemoryMock = (address) => {
    t.context.readMemoryAddressAccess.push(address);
    return t.context.readMemoryAddress.pop();
  };
  const writeMemoryMock = (address, value) => {
    t.context.writeMemoryAddress.push({ address, value });
  };
  const cpu = Cpu6809.getInstance(writeMemoryMock, readMemoryMock, 'UNITTEST');
  t.context = {
    cpu,
    readMemoryAddressAccess: [],
    readMemoryAddress: [],
    writeMemoryAddress: [],
  };
});

test('should read RESET vector on boot', (t) => {
  const cpu = t.context.cpu;
  cpu.reset();
  t.deepEqual(t.context.readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI ]);
});

test('ROLA 0xFF', (t) => {
  const OP_ROLA = 0x49;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_ROLA, 0xFF);

  t.is(cpu.regA, 0xFE);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvC');
});

test('ROLA, 0xFF - carry flag set', (t) => {
  const OP_ROLA = 0x49;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_ROLA, 0xFF, (t) => {
    const cc = t.context.cpu.regCC |= 1;
    cpu.set('FLAGS', cc);
  });

  t.is(cpu.regA, 0xFF);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvC');
});

test('RORA, 0x01 (no overflow)', (t) => {
  const OP_RORA = 0x46;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_RORA, 0x01);

  t.is(cpu.regA, 0x0);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInZvC');
});

test('RORA, 0xFF - carry flag not set', (t) => {
  const OP_RORA = 0x46;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_RORA, 0xFF);

  t.is(cpu.regA, 0x7F);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzvC');
});

test('RORA, 0xFF - carry flag set', (t) => {
  const OP_RORA = 0x46;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_RORA, 0xFF, (t) => {
    const cc = t.context.cpu.regCC |= 1;
    cpu.set('FLAGS', cc);
  });

  t.is(cpu.regA, 0xFF);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvC');
});

test('ADDA / oADD', (t) => {
  const OP_ADDA = 0x8B;
  const ADD_VALUE_1 = 0xFF;
  const ADD_VALUE_2 = 0xFF;
  const cpu = t.context.cpu;
  cpu.set('flags', 0x00);

  // add command in reverse order
  t.context.readMemoryAddress = [ ADD_VALUE_2, OP_ADDA, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  cpu.regA = ADD_VALUE_1;
  cpu.step();

  t.deepEqual(t.context.readMemoryAddressAccess,
    [ RESET_VECTOR_OFFSET_LO, RESET_VECTOR_OFFSET_HI, EXPECTED_RESET_READ_OFFSET_LO, EXPECTED_RESET_READ_OFFSET_HI ]);
  t.is(cpu.regA, 254);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFHINzvC');
});

test('LSRA', (t) => {
  const OP_LSRA = 0x44;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_LSRA, 0xFF);

  t.is(cpu.regA, 0x7F);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzvC');
});

test('ASLA, overflow', (t) => {
  const OP_ASLA = 0x48;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_ASLA, 0x81);

  t.is(cpu.regA, 2);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzVC');
});

test('ASLA, no overflow', (t) => {
  const OP_ASLA = 0x48;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_ASLA, 0x01);

  t.is(cpu.regA, 2);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzvc');
});

test('ASRA (0xFF)', (t) => {
  const OP_ASRA = 0x47;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_ASRA, 0xFF);

  t.is(cpu.regA, 0xFF);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvC');
});

test('ASRA (0x7F)', (t) => {
  const OP_ASRA = 0x47;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_ASRA, 0x7F);

  t.is(cpu.regA, 0x3F);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzvC');
});

test('ASRA (0)', (t) => {
  const OP_ASRA = 0x47;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_ASRA, 0);

  t.is(cpu.regA, 0);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInZvc');
});

test('oNEG, 0x1', (t) => {
  const OP_NEG = 0x40;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_NEG, 0x01);

  t.is(cpu.regA, 0xFF);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvC');
});

test('oNEG, 0xFF', (t) => {
  const OP_NEG = 0x40;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_NEG, 0xFF);

  t.is(cpu.regA, 0x01);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzvc');
});

test('oDEC, 0x80 (no overflow)', (t) => {
  const OP_DEC = 0x4A;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_DEC, 0x80);

  t.is(cpu.regA, 0x7F);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzVc');
});

test('oDEC, 0x0 (overflow)', (t) => {
  const OP_DEC = 0x4A;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_DEC, 0x00);

  t.is(cpu.regA, 0xFF);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhINzvc');
});

test('oDEC extended memory, 0x0 (overflow)', (t) => {
  const OP_DEC = 0x7A;
  const cpu = t.context.cpu;
  runExtendedMemoryTest(t, OP_DEC, 0x00);

  t.deepEqual(t.context.writeMemoryAddress, [{ address: 8721, value: 0xFF }]);
  t.is(cpu.tickCount, 7);
  t.is(cpu.flagsToString(), 'eFhINzvc');
});

test('oINC, 0x00 (no overflow)', (t) => {
  const OP_INC = 0x4C;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_INC, 0x00);

  t.is(cpu.regA, 0x01);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInzvc');
});

test('oINC, 0xFF (overflow)', (t) => {
  const OP_INC = 0x4C;
  const cpu = t.context.cpu;
  runRegisterATest(t, OP_INC, 0xFF);

  t.is(cpu.regA, 0x00);
  t.is(cpu.tickCount, 2);
  t.is(cpu.flagsToString(), 'eFhInZvc');
});

test('oINC extended memory, 0xFF (overflow)', (t) => {
  const OP_INC = 0x7C;
  const cpu = t.context.cpu;
  runExtendedMemoryTest(t, OP_INC, 0xFF);

  t.deepEqual(t.context.writeMemoryAddress, [{ address: 8721, value: 0x00 }]);
  t.is(cpu.tickCount, 7);
  t.is(cpu.flagsToString(), 'eFhInZvc');
});

test('PUSHB should wrap around', (t) => {
  const cpu = t.context.cpu;
  cpu.reset();
  cpu.PUSHB(0x23);
  t.deepEqual(t.context.writeMemoryAddress, [{ address: 65535, value: 0x23 }]);
});

test('PUSHW should wrap around', (t) => {
  const cpu = t.context.cpu;
  cpu.reset();
  cpu.PUSHW(0x1234);
  t.deepEqual(t.context.writeMemoryAddress, [{ address: 65535, value: 0x34 }, { address: 65534, value: 0x12 }]);
});

test('PUSHBU should wrap around', (t) => {
  const cpu = t.context.cpu;
  cpu.reset();
  cpu.PUSHBU(0x23);
  t.deepEqual(t.context.writeMemoryAddress, [{ address: 65535, value: 0x23 }]);
});

test('PUSHWU should wrap around', (t) => {
  const cpu = t.context.cpu;
  cpu.reset();
  cpu.PUSHWU(0x1234);
  t.deepEqual(t.context.writeMemoryAddress, [{ address: 65535, value: 0x34 }, { address: 65534, value: 0x12 }]);
});

function runRegisterATest(t, opcode, registerA, postCpuResetInitFunction) {
  const cpu = t.context.cpu;

  // add command in reverse order
  t.context.readMemoryAddress = [ opcode, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  if (typeof postCpuResetInitFunction === 'function') {
    postCpuResetInitFunction(t);
  }
  cpu.regA = registerA;
  cpu.step();

  t.deepEqual(t.context.readMemoryAddressAccess,[
    RESET_VECTOR_OFFSET_LO,
    RESET_VECTOR_OFFSET_HI,
    EXPECTED_RESET_READ_OFFSET_LO
  ]);
}

function runExtendedMemoryTest(t, opcode, memoryContent, postCpuResetInitFunction) {
  const hardcodedReadOffsetLo = 0x11;
  const hardcodedReadOffsetHi = 0x22;
  const hardcodedReadOffset = 0x2211;
  const cpu = t.context.cpu;

  // add command in reverse order
  t.context.readMemoryAddress = [ memoryContent, hardcodedReadOffsetLo, hardcodedReadOffsetHi, opcode, RESET_VECTOR_VALUE_LO, RESET_VECTOR_VALUE_HI ];

  cpu.reset();
  if (typeof postCpuResetInitFunction === 'function') {
    postCpuResetInitFunction(t);
  }
  cpu.step();

  t.deepEqual(t.context.readMemoryAddressAccess, [
    RESET_VECTOR_OFFSET_LO,
    RESET_VECTOR_OFFSET_HI,
    EXPECTED_RESET_READ_OFFSET_LO,
    EXPECTED_RESET_READ_OFFSET_LO + 1,
    EXPECTED_RESET_READ_OFFSET_LO + 2,
    hardcodedReadOffset,
  ]);
}

for (let offset = 0; offset < 16; offset++) {
  test('postbyte simple X: ' + offset, (t) => {
    const cpu = t.context.cpu;
    t.context.readMemoryAddress = [ offset ];
    cpu.set('flags', 0);
    cpu.regX = 0;
    cpu.regPC = 0;
    const result = cpu.PostByte();
    t.is(result, offset);
    t.is(cpu.flagsToString(), 'efhinzvc');
    t.is(cpu.regX, 0);
    t.deepEqual(t.context.readMemoryAddressAccess, [
      0,
    ]);
  });
}

for (let offset = 16; offset < 32; offset++) {
  test('postbyte simple X: ' + offset, (t) => {
    const cpu = t.context.cpu;
    t.context.readMemoryAddress = [ offset ];
    cpu.set('flags', 0);
    cpu.regX = 0;
    cpu.regPC = 0;
    const result = cpu.PostByte();
    t.is(result, 0x10000 - (32 - offset));
    t.is(cpu.flagsToString(), 'efhinzvc');
    t.is(cpu.regX, 0);
    t.deepEqual(t.context.readMemoryAddressAccess, [
      0,
    ]);
  });
}
