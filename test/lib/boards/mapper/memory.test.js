const test = require('ava');
const MemoryMapper = require('../../../../lib/boards/mapper/memory');

test('MemoryMapper, should get address, 16322', (t) => {
  const expectedResult = {
    offset: 16322,
    subsystem: 'hardware',
  };
  const result = MemoryMapper.getAddress(16322);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 49090 - this crashes the emu', (t) => {
  const expectedResult = {
    offset: 16322,
    subsystem: 'system',
  };
  const result = MemoryMapper.getAddress(49090);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should fail when using invalid offset', (t) => {
  t.throws(MemoryMapper.getAddress, { message: 'MEMORY_GET_ADDRESS_UNDEFINED' });
});

test('MemoryMapper, should get address, -1', (t) => {
  const expectedResult = {
    offset: 32767,
    subsystem: 'system',
  };
  const result = MemoryMapper.getAddress(-1);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 0x0', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'ram',
  };
  const result = MemoryMapper.getAddress(0x0);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 0x2000', (t) => {
  const expectedResult = {
    offset: 0x2000,
    subsystem: 'ram',
  };
  const result = MemoryMapper.getAddress(0x2000);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 0x2900', (t) => {
  const expectedResult = {
    offset: 0x2900,
    subsystem: 'ram',
  };
  const result = MemoryMapper.getAddress(0x2900);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 0x4000', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'bank',
  };
  const result = MemoryMapper.getAddress(0x4000);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 0x8000', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'system',
  };
  const result = MemoryMapper.getAddress(0x8000);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 0x10000', (t) => {
  const expectedResult = {
    offset: 0,
    subsystem: 'ram',
  };
  const result = MemoryMapper.getAddress(0x10000);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 0x3C00', (t) => {
  const expectedResult = {
    offset: 0x3C00,
    subsystem: 'ram',
  };
  const result = MemoryMapper.getAddress(0x3C00);
  t.deepEqual(result, expectedResult);
});

test('MemoryMapper, should get address, 0x3FAF', (t) => {
  const expectedResult = {
    offset: 0x3FAF,
    subsystem: 'ram',
  };
  const result = MemoryMapper.getAddress(0x3FAF);
  t.deepEqual(result, expectedResult);
});
