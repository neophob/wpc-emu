'use strict';

const test = require('ava');
const MemoryHandler = require('../../../lib/boards/memory-handler');

test.beforeEach((t) => {
  const config = {
    checksum: [
      { dataStartOffset: 0x1D29, dataEndOffset: 0x1D48, checksumOffset: 0x1D49, checksum: '16bit', name: 'HIGHSCORE' },
    ]
  };

  t.context = MemoryHandler.getInstance(
    config,
    new Uint8Array(8192).fill(0)
  );
});

test('MemoryHandler: should not update checksum', (t) => {
  const OFFSET = 0;
  const memoryHandler = t.context;
  memoryHandler.writeMemory(OFFSET, 1);
  const newValueWritten = memoryHandler.ram[OFFSET] === 1;
  let valuesNotZero = 0;
  for (const n of memoryHandler.ram) {
    if (n !== 0) {
      valuesNotZero++;
    }
  }
  t.is(newValueWritten, true);
  t.is(valuesNotZero, 1);
});

test('MemoryHandler: should write number, check checksum', (t) => {
  const OFFSET = 0x1D29;
  const memoryHandler = t.context;
  memoryHandler.writeMemory(OFFSET, 1);
  t.is(memoryHandler.ram[0x1D49], 0xFF);
  t.is(memoryHandler.ram[0x1D4A], 0xFE);
});

test('MemoryHandler: should write array, check checksum', (t) => {
  const OFFSET = 0x1D29;
  const memoryHandler = t.context;
  memoryHandler.writeMemory(OFFSET, [1]);
  t.is(memoryHandler.ram[0x1D49], 0xFF);
  t.is(memoryHandler.ram[0x1D4A], 0xFE);
});

test('MemoryHandler: should write string, check checksum', (t) => {
  const OFFSET = 0x1D29;
  const memoryHandler = t.context;
  memoryHandler.writeMemory(OFFSET, '\x31');
  t.is(memoryHandler.ram[0x1D49], 0xFF);
  t.is(memoryHandler.ram[0x1D4A], 0xFE);
});

test('MemoryHandler: should update checksum (start)', (t) => {
  const OFFSET = 0x1D29;
  const memoryHandler = t.context;
  memoryHandler.writeMemory(OFFSET, 1);
  const newValueWritten = memoryHandler.ram[OFFSET] === 1;
  let valuesNotZero = 0;
  for (const n of memoryHandler.ram) {
    if (n !== 0) {
      valuesNotZero++;
    }
  }
  t.is(newValueWritten, true);
  t.is(valuesNotZero, 3);
});

test('MemoryHandler: should update checksum (end)', (t) => {
  const OFFSET = 0x1D48;
  const memoryHandler = t.context;
  memoryHandler.writeMemory(OFFSET, 1);
  const newValueWritten = memoryHandler.ram[OFFSET] === 1;
  let valuesNotZero = 0;
  for (const n of memoryHandler.ram) {
    if (n !== 0) {
      valuesNotZero++;
    }
  }
  t.is(newValueWritten, true);
  t.is(valuesNotZero, 3);
});
