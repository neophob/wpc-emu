const crypto = require('crypto');
const test = require('ava');
const OutputAlphaDisplay = require('../../../../lib/boards/elements/output-alpha-display');

test.beforeEach((t) => {
  t.context.outputAlphaDisplay = OutputAlphaDisplay.getInstance(0x200);
});

test('outputAlphaDisplay, setSegmentColumn', (t) => {
  const outputAlphaDisplay = t.context.outputAlphaDisplay;
  outputAlphaDisplay.setSegmentColumn(0xFF);
  t.is(outputAlphaDisplay.segmentColumn, 0xF);
});

test('outputAlphaDisplay, getState', (t) => {
  const outputAlphaDisplay = t.context.outputAlphaDisplay;
  const result = outputAlphaDisplay.getState();
  t.is(result.scanline, 0);
  t.deepEqual(result.dmdShadedBuffer, new Uint8Array(0x200 * 8).fill(0));
});

test('outputAlphaDisplay, empty setState', (t) => {
  const outputAlphaDisplay = t.context.outputAlphaDisplay;
  const result = outputAlphaDisplay.setState();
  t.is(result, false);
});

test('outputAlphaDisplay, setState', (t) => {
  const outputAlphaDisplay = t.context.outputAlphaDisplay;
  outputAlphaDisplay.setState({ scanline: 5 });
  const result = outputAlphaDisplay.getState();
  t.is(result.scanline, 5);
});

test('outputAlphaDisplay, setRow1 low', (t) => {
  const outputAlphaDisplay = t.context.outputAlphaDisplay;
  outputAlphaDisplay.setRow1(false, 0xFFFF);
  const result = outputAlphaDisplay.displayData;
  t.deepEqual(result[0], 0x00FF);
  t.deepEqual(result[1], 0x0000);
});

test('outputAlphaDisplay, setRow1 high', (t) => {
  const outputAlphaDisplay = t.context.outputAlphaDisplay;
  outputAlphaDisplay.setRow1(true, 0xFFFF);
  const result = outputAlphaDisplay.displayData;
  t.deepEqual(result[0], 0xFF00);
  t.deepEqual(result[1], 0x0000);
});

test('outputAlphaDisplay, setRow2 low', (t) => {
  const outputAlphaDisplay = t.context.outputAlphaDisplay;
  outputAlphaDisplay.setSegmentColumn(1);
  outputAlphaDisplay.setRow2(false, 0xFFFF);
  const result = outputAlphaDisplay.displayData;
  t.deepEqual(result[17], 0x00FF);
});

test('outputAlphaDisplay, setRow2 high', (t) => {
  const outputAlphaDisplay = t.context.outputAlphaDisplay;
  outputAlphaDisplay.setSegmentColumn(2);
  outputAlphaDisplay.setRow2(true, 0xFFFF);
  const result = outputAlphaDisplay.displayData;
  t.deepEqual(result[18], 0xFF00);
});

test('outputAlphaDisplay, render', (t) => {
  const outputAlphaDisplay = t.context.outputAlphaDisplay;
  for (let i = 0; i < 16; i++) {
    outputAlphaDisplay.setSegmentColumn(i);
    outputAlphaDisplay.setRow1(true, 0xFFFF);
    outputAlphaDisplay.setRow1(false, 0xFFFF);
    outputAlphaDisplay.setRow2(true, 0xFFFF);
    outputAlphaDisplay.setRow2(false, 0xFFFF);
  }
  outputAlphaDisplay.executeCycle(10000000);

  const result = outputAlphaDisplay.getState();
  const dmdHash = crypto.createHash('sha1').update(result.dmdShadedBuffer).digest('hex');
  t.is(dmdHash, 'd3706dc84ddfc27e5fa0ba57a8f469fac4472bda');
});
