'use strict';

import test from 'ava';
import UI from '../../../lib/boards/ui';

test.beforeEach((t) => {
  const memoryPosition = {
    knownValues: [
      { offset: 0, description: 'valid1', type: 'string' },
      { offset: 1, description: 'valid2', type: 'uint8' },
      { offset: 2, description: 'valid3', type: 'bcd' },
      { offset: 3, description: 'valid4', type: 'uint8', length: 4 },
      { offset: 0x3AD, description: 'invalid1', type: 'foo' },
      { description: 'invalid2', type: 'uint8' },
    ]
  };

  const dummyState = {
    display: {
      dmdShadedBuffer: [],
      videoRam: [],
    },
    wpc: {
      lampState: [],
      solenoidState: [],
      inputState: [],
    },
    ram: new Uint8Array([ 11, 22, 0x65, 0x66, 0x67, 0x68, 0x69, 0x70, 0x71, 1, 2, 3 ]),
  };

  const dummyStateString = {
    display: {
      dmdShadedBuffer: [],
      videoRam: [],
    },
    wpc: {
      lampState: [],
      solenoidState: [],
      inputState: [],
    },
    ram: new Uint8Array([ 65, 65, 65, 0, 65, 65 ]),
  };
  const ui = UI.getInstance(memoryPosition);
  t.context = {
    ui,
    dummyState,
    dummyStateString,
  };
});

test('UI: should filter out invalid memoryPosition entries', (t) => {
  const ui = t.context.ui;
  t.is(ui.memoryPosition.length, 4);
});

test('UI: should fetch data from ram', (t) => {
  const ui = t.context.ui;
  const result = ui.getChangedState(t.context.dummyState);

  t.is(result.memoryPosition.length, 4);
  t.is(result.memoryPosition[0].value, '');
  t.is(result.memoryPosition[1].value, 22);
  t.is(result.memoryPosition[2].value, 6566);
  t.is(result.memoryPosition[3].value, 0x66676869);
});

test('UI: should fetch data from ram (string)', (t) => {
  const ui = t.context.ui;
  const result = ui.getChangedState(t.context.dummyStateString);
  t.is(result.memoryPosition[0].value, 'AAA');
});

test('UI: should cap very long string', (t) => {
  const ui = t.context.ui;
  const data = t.context.dummyStateString;
  data.ram = new Uint8Array(500).fill(65);
  const result = ui.getChangedState(data);
  console.log(result.memoryPosition[0]);
  t.is(result.memoryPosition[0].value.length, 32);
});
