'use strict';

import test from 'ava';
import crypto from 'crypto';
import OutputDmdDisplay from '../../../../lib/boards/elements/output-dmd-display';

test.beforeEach((t) => {
  t.context.outputDmdDisplay = OutputDmdDisplay.getInstance(0x200);
});

test('outputDmdDisplay, should return undefined when no scanline is copied', (t) => {
  const outputDmdDisplay = t.context.outputDmdDisplay;
  const result = outputDmdDisplay.executeCycle(1);
  t.is(result, undefined);
});

test('outputDmdDisplay, should return json object when scanline is copied', (t) => {
  const outputDmdDisplay = t.context.outputDmdDisplay;
  const result = outputDmdDisplay.executeCycle(100000000);
  t.deepEqual(result, {
    requestFIRQ: true,
    scanline: 1,
  });
});

test('outputDmdDisplay, getState', (t) => {
  const outputDmdDisplay = t.context.outputDmdDisplay;
  const result = outputDmdDisplay.getState();
  t.is(result.scanline, 0);
  t.is(result.activepage, 0);
  t.is(result.nextActivePage, undefined);
  t.is(result.requestFIRQ, true);
  t.is(result.videoOutputPointer, 0);
  t.is(result.ticksUpdateDmd, 0);
  t.deepEqual(result.dmdPageMapping, [0, 0, 0, 0, 0, 0]);
});

test('outputDmdDisplay, selectDmdPage', (t) => {
  const outputDmdDisplay = t.context.outputDmdDisplay;
  outputDmdDisplay.selectDmdPage(1, 0xFF);
  const result = outputDmdDisplay.getState();
  t.deepEqual(result.dmdPageMapping, [0, 0xF, 0, 0, 0, 0]);
});

test('outputDmdDisplay, setNextActivePage', (t) => {
  const outputDmdDisplay = t.context.outputDmdDisplay;
  outputDmdDisplay.setNextActivePage(0xFF);
  const result = outputDmdDisplay.getState();
  t.is(result.nextActivePage, 0xF);
});

test('outputDmdDisplay, writeVideoRam and readVideoRam', (t) => {
  const outputDmdDisplay = t.context.outputDmdDisplay;
  const BANK = 2;
  const OFFSET = 1;
  outputDmdDisplay.writeVideoRam(BANK, OFFSET, 33);
  const result = outputDmdDisplay.readVideoRam(BANK, OFFSET);
  t.is(result, 33);
});

test('outputDmdDisplay, should switch to next active page', (t) => {
  const outputDmdDisplay = t.context.outputDmdDisplay;  
  outputDmdDisplay.setNextActivePage(1);
  for (let i = 0; i < 0x20; i++) {
    outputDmdDisplay.executeCycle(10000000);
  }

  const result = outputDmdDisplay.getState();
  t.is(result.activepage, 1);
  t.is(result.nextActivePage, undefined);
});

test('outputDmdDisplay, render', (t) => {
  const outputDmdDisplay = t.context.outputDmdDisplay;   
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 222; j++) {
      outputDmdDisplay.writeVideoRam(i, j, 0xAA);
    }
  }
  outputDmdDisplay.executeCycle(10000000);

  const result = outputDmdDisplay.getState();
  const dmdHash = crypto.createHash('sha1').update(result.dmdShadedBuffer).digest('hex');
  t.is(dmdHash, '1ceaf73df40e531df3bfb26b4fb7cd95fb7bff1d');
});
