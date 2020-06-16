'use strict';

const test = require('ava');
const DisplayBoard = require('../../../lib/boards/display-board');

test.beforeEach((t) => {
  const ram = new Uint8Array(0x4000);
  const initObject = {
    interruptCallback: {},
    ram,
  };
  const displayBoard = DisplayBoard.getInstance(initObject);
  displayBoard.reset();
  t.context = displayBoard;
});

test('displayBoard, should write to hardwareRam', (t) => {
  const displayBoard = t.context;
  displayBoard.write(0x3FBD, 255);
  t.is(displayBoard.ram[0x3FBD], 0xFF);
});

test('displayBoard, should read to WPC_DMD_SCANLINE', (t) => {
  const displayBoard = t.context;
  const result = displayBoard.read(0x3FBD);
  t.is(result, 0x0);
});

test('displayBoard, should map WPC_DMD_LOW_PAGE', (t) => {
  const displayBoard = t.context;
  displayBoard.write(DisplayBoard.OP.WPC_DMD_LOW_PAGE, 2);
  const result = displayBoard.getState();
  t.is(result.dmdPageMapping[0], 2);
});

test('displayboard, should map WPC_DMD_LOW_PAGE, wrap value', (t) => {
  const displayBoard = t.context;
  displayBoard.write(DisplayBoard.OP.WPC_DMD_LOW_PAGE, 0xFF);
  const result = displayBoard.getState();
  t.is(result.dmdPageMapping[0], 0xF);
});

test('displayboard, should map WPC_DMD_HIGH_PAGE', (t) => {
  const displayBoard = t.context;
  displayBoard.write(DisplayBoard.OP.WPC_DMD_HIGH_PAGE, 3);
  const result = displayBoard.getState();
  t.is(result.dmdPageMapping[1], 3);
});

test('displayboard, should map WPC95_DMD_PAGE3000', (t) => {
  const displayBoard = t.context;
  displayBoard.write(DisplayBoard.OP.WPC95_DMD_PAGE3000, 5);
  const result = displayBoard.getState();
  t.is(result.dmdPageMapping[2], 5);
});

test('displayboard, should map WPC95_DMD_PAGE3200', (t) => {
  const displayBoard = t.context;
  displayBoard.write(DisplayBoard.OP.WPC95_DMD_PAGE3200, 6);
  const result = displayBoard.getState();
  t.is(result.dmdPageMapping[3], 6);
});

test('displayboard, should map WPC95_DMD_PAGE3400', (t) => {
  const displayBoard = t.context;
  displayBoard.write(DisplayBoard.OP.WPC95_DMD_PAGE3400, 7);
  const result = displayBoard.getState();
  t.is(result.dmdPageMapping[4], 7);
});

test('displayboard, should map WPC95_DMD_PAGE3600', (t) => {
  const displayBoard = t.context;
  displayBoard.write(DisplayBoard.OP.WPC95_DMD_PAGE3600, 8);
  const result = displayBoard.getState();
  t.is(result.dmdPageMapping[5], 8);
});

test('displayboard, should write next active page, wrap around', (t) => {
  const displayBoard = t.context;
  displayBoard.write(DisplayBoard.OP.WPC_DMD_ACTIVE_PAGE, 0xFF);
  const result = displayBoard.getState();
  t.is(result.nextActivePage, 0xF);
});

[
  {
    offset: 0x3800,
    command: DisplayBoard.OP.WPC_DMD_LOW_PAGE,
  },
  {
    offset: 0x3A00,
    command: DisplayBoard.OP.WPC_DMD_HIGH_PAGE,
  },
  {
    offset: 0x3000,
    command: DisplayBoard.OP.WPC95_DMD_PAGE3000,
  },
  {
    offset: 0x3200,
    command: DisplayBoard.OP.WPC95_DMD_PAGE3200,
  },
  {
    offset: 0x3400,
    command: DisplayBoard.OP.WPC95_DMD_PAGE3400,
  },
  {
    offset: 0x3600,
    command: DisplayBoard.OP.WPC95_DMD_PAGE3600,
  },
].forEach((testSet) => {
  test('displayboard, should write to DMD RAM ' + testSet.offset, (t) => {
    const displayBoard = t.context;
    const PAGE = 2;
    const VALUE = 0xFE;
    displayBoard.write(testSet.command, PAGE);
    displayBoard.write(testSet.offset, VALUE);
    const result = displayBoard.read(testSet.offset);
    t.is(result, VALUE);
    const state = displayBoard.getState();
    t.is(state.videoRam[0x200 * PAGE], VALUE);
  });
});
