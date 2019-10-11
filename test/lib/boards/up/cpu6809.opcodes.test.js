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
    t.is(cpu.tickCount, 1);
    t.deepEqual(t.context.readMemoryAddressAccess, [ 0 ]);
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
    t.is(cpu.tickCount, 1);
    t.deepEqual(t.context.readMemoryAddressAccess, [ 0 ]);
  });
}

for (let offset = 0x60; offset < 0x70; offset++) {
  test('postbyte simple S: ' + offset, (t) => {
    const cpu = t.context.cpu;
    t.context.readMemoryAddress = [ offset ];
    cpu.set('flags', 0);
    cpu.regS = 0;
    cpu.regPC = 0;
    const result = cpu.PostByte();
    t.is(result, offset - 0x60);
    t.is(cpu.flagsToString(), 'efhinzvc');
    t.is(cpu.regS, 0);
    t.is(cpu.tickCount, 1);
    t.deepEqual(t.context.readMemoryAddressAccess, [ 0 ]);
  });
}

for (let offset = 0x70; offset < 0x80; offset++) {
  test('postbyte simple S: ' + offset, (t) => {
    const cpu = t.context.cpu;
    t.context.readMemoryAddress = [ offset ];
    cpu.set('flags', 0);
    cpu.regS = 0;
    cpu.regPC = 0;
    const result = cpu.PostByte();
    t.is(result, 0x10000 - (32 - offset) - 0x60);
    t.is(cpu.flagsToString(), 'efhinzvc');
    t.is(cpu.regS, 0);
    t.is(cpu.tickCount, 1);
    t.deepEqual(t.context.readMemoryAddressAccess, [ 0 ]);
  });
}

[
  {
    offset: 0x80, register: 'regX',
    expectedResult: 11, expectedTicks: 2, expectedReturn: 10, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0x81, register: 'regX',
    expectedResult: 12, expectedTicks: 3, expectedReturn: 10, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0x85, register: 'regX', initialValue: 0xFFFF, initialRegB: 10,
    expectedResult: 0xFFFF, expectedTicks: 1, expectedReturn: 9, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0x88, register: 'regX',
    expectedResult: 10, expectedTicks: 1, expectedReturn: 0, expectedMemoryRead: [ 0, 1 ]
  },
  {
    offset: 0x88, register: 'regX', initialValue: 100,
    expectedResult: 100, expectedTicks: 1, expectedReturn: 0, expectedMemoryRead: [ 0, 1 ]
  },
  {
    offset: 0x89, register: 'regX',
    expectedResult: 10, expectedTicks: 4, expectedReturn: 0, expectedMemoryRead: [ 0, 1, 2 ]
  },
  {
    offset: 0x8B, register: 'regX',
    expectedResult: 10, expectedTicks: 4, expectedReturn: 10, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0x8B, register: 'regX', initialRegB: 5,
    expectedResult: 10, expectedTicks: 4, expectedReturn: 15, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0x8C, register: 'regX',
    expectedResult: 10, expectedTicks: 1, expectedReturn: 0, expectedMemoryRead: [ 0, 1 ]
  },
  {
    offset: 0x8D, register: 'regX',
    expectedResult: 10, expectedTicks: 5, expectedReturn: 0, expectedMemoryRead: [ 0, 1, 2 ]
  },
  {
    offset: 0x8F, register: 'regX',
    expectedResult: 10, expectedTicks: 5, expectedReturn: 0, expectedMemoryRead: [ 0, 1, 2 ]
  },

  {
    offset: 0x90, register: 'regX',
    expectedResult: 11, expectedTicks: 5, expectedReturn: 0, expectedMemoryRead: [ 0, 10, 11 ]
  },
  {
    offset: 0x91, register: 'regX',
    expectedResult: 12, expectedTicks: 6, expectedReturn: 0, expectedMemoryRead: [ 0, 10, 11 ]
  },
  {
    // check overflow
    offset: 0x91, register: 'regX', initialValue: 0xFFFF,
    expectedResult: 1, expectedTicks: 6, expectedReturn: 0, expectedMemoryRead: [ 0, 0xFFFF, 0 ]
  },
  {
    offset: 0x92, register: 'regX',
    expectedResult: 9, expectedTicks: 5, expectedReturn: 0, expectedMemoryRead: [ 0, 9, 10 ]
  },
  {
    offset: 0x92, register: 'regX', initialValue: 0, comment: 'check underflow',
    expectedResult: 0xFFFF, expectedTicks: 5, expectedReturn: 0, expectedMemoryRead: [ 0, 0xFFFF, 0 ]
  },
  {
    offset: 0x93, register: 'regX',
    expectedResult: 8, expectedTicks: 6, expectedReturn: 0, expectedMemoryRead: [ 0, 8, 9 ]
  },
  {
    offset: 0x93, register: 'regX', initialValue: 0, comment: 'check underflow',
    expectedResult: 0xFFFE, expectedTicks: 6, expectedReturn: 0, expectedMemoryRead: [ 0, 0xFFFE, 0xFFFF ]
  },
  {
    offset: 0x94, register: 'regX',
    expectedResult: 10, expectedTicks: 3, expectedReturn: 0, expectedMemoryRead: [ 0, 10, 11 ]
  },
  {
    offset: 0x94, register: 'regX', initialValue: 0xFFFF, comment: 'check overflow',
    expectedResult: 0xFFFF, expectedTicks: 3, expectedReturn: 0, expectedMemoryRead: [ 0, 0xFFFF, 0 ]
  },
  {
    offset: 0x95, register: 'regX', initialRegB: 10, comment: 'regB positive',
    expectedResult: 10, expectedTicks: 4, expectedReturn: 0, expectedMemoryRead: [ 0, 20, 21 ]
  },
  {
    offset: 0x95, register: 'regX', initialRegB: 0x80, comment: 'regB negative, underflow',
    expectedResult: 10, expectedTicks: 4, expectedReturn: 0, expectedMemoryRead: [ 0, 0xFF8A, 0xFF8B ]
  },

  {
    offset: 0xA0, register: 'regY',
    expectedResult: 11, expectedTicks: 2, expectedReturn: 10, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0xA1, register: 'regY',
    expectedResult: 12, expectedTicks: 3, expectedReturn: 10, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0xB0, register: 'regY',
    expectedResult: 11, expectedTicks: 5, expectedReturn: 0, expectedMemoryRead: [ 0, 10, 11 ]
  },
  {
    offset: 0xB1, register: 'regY',
    expectedResult: 12, expectedTicks: 6, expectedReturn: 0, expectedMemoryRead: [ 0, 10, 11 ]
  },

  {
    offset: 0xC0, register: 'regU',
    expectedResult: 11, expectedTicks: 2, expectedReturn: 10, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0xC1, register: 'regU',
    expectedResult: 12, expectedTicks: 3, expectedReturn: 10, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0xD0, register: 'regU',
    expectedResult: 11, expectedTicks: 5, expectedReturn: 0, expectedMemoryRead: [ 0, 10, 11 ]
  },
  {
    offset: 0xD1, register: 'regU',
    expectedResult: 12, expectedTicks: 6, expectedReturn: 0, expectedMemoryRead: [ 0, 10, 11 ]
  },

  {
    offset: 0xE0, register: 'regS',
    expectedResult: 11, expectedTicks: 2, expectedReturn: 10, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0xE1, register: 'regS',
    expectedResult: 12, expectedTicks: 3, expectedReturn: 10, expectedMemoryRead: [ 0 ]
  },
  {
    offset: 0xF0, register: 'regS',
    expectedResult: 11, expectedTicks: 5, expectedReturn: 0, expectedMemoryRead: [ 0, 10, 11 ]
  },
  {
    offset: 0xF1, register: 'regS',
    expectedResult: 12, expectedTicks: 6, expectedReturn: 0, expectedMemoryRead: [ 0, 10, 11 ]
  },
].forEach((testData, index) => {
  const hexValue = '0x' + testData.offset.toString(16).toUpperCase();
  const initialValue = Number.isInteger(testData.initialValue) ? (' initialValue:' + testData.initialValue) : '';
  const comment = testData.comment ? ' ' + testData.comment + ',' : '';
  const description = testData.register + ': ' + hexValue + comment + initialValue;

  test('test: ' + index + ', postbyte complex ' + description, (t) => {
    const cpu = t.context.cpu;
    t.context.readMemoryAddress = [ testData.offset ];
    cpu.set('flags', 0);
    cpu.regB = testData.initialRegB || 0;
    cpu[testData.register] = Number.isInteger(testData.initialValue) ? testData.initialValue : 10;
    cpu.regPC = 0;
    const result = cpu.PostByte();
    t.is(result, testData.expectedReturn);
    t.is(cpu[testData.register], testData.expectedResult);
    t.is(cpu.tickCount, testData.expectedTicks);
    t.deepEqual(t.context.readMemoryAddressAccess, testData.expectedMemoryRead);
  });
});

test('postbyte complex 0x8C', (t) => {
  const cpu = t.context.cpu;
  t.context.readMemoryAddress = [ 0x55, 0x8C ];
  cpu.set('flags', 0);
  cpu.regPC = 0x1000;
  const result = cpu.PostByte();
  t.is(result, 0x1057);
  t.is(cpu.flagsToString(), 'efhinzvc');
  t.is(cpu.regPC, 0x1002);
  t.is(cpu.tickCount, 1);
  t.deepEqual(t.context.readMemoryAddressAccess, [ 0x1000, 0x1001 ]);
});

test('postbyte complex 0x8D', (t) => {
  const cpu = t.context.cpu;
  t.context.readMemoryAddress = [ 0x99, 0x55, 0x8D ];
  cpu.set('flags', 0);
  cpu.regPC = 0x1000;
  const result = cpu.PostByte();
  t.is(result, 0x659C);
  t.is(cpu.flagsToString(), 'efhinzvc');
  t.is(cpu.regPC, 0x1003);
  t.is(cpu.tickCount, 5);
  t.deepEqual(t.context.readMemoryAddressAccess, [ 0x1000, 0x1001, 0x1002 ]);
});
