'use strict';

import test from 'ava';
import { parseMessage } from '../../../scripts/bluetooth/parser';

function getDataView() {
  const data = [0, 0, 125, -89, -21, -49, -25, 124, -123, 82, 111, 116, 68, 85];
  const buffer = new ArrayBuffer(data.length);
  const view = new DataView(buffer);

  let offset = 0;
  data.forEach((byte) => {
    view.setUint8(offset++, byte);
  });

  return view;
}

test('bluetooth parser, should parse message', (t) => {
  const view = getDataView();

  const result = parseMessage(view);
  t.deepEqual(result, {
    coinDoorState: 68,
    fliptronicState: 85,
    inputSwitchStateHi: 2236772212,
    inputSwitchStateLo: 3956270972,
    zeroCrossCounter: 32167,
  });
});

test('bluetooth parser, should return delta message', (t) => {
  const view = getDataView();
  const listData = {
    coinDoorState: 68,
    fliptronicState: 85,
  };

  const result = parseMessage(view, listData);
  t.deepEqual(result, {
    inputSwitchStateHi: 2236772212,
    inputSwitchStateLo: 3956270972,
    zeroCrossCounter: 32167,
  });
});
