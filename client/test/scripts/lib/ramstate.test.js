'use strict';

import test from 'ava';
import { loadRam, saveRam } from '../../../scripts/lib/ramstate';

test('initialiseActions, should return resolved promise', (t) => {
  return initialiseActions()
    .then((value) => {
      t.is(value, undefined);
    });
});

test('initialiseActions, should init closedSwitches', (t) => {
  const mockWpcSystem = t.context.mockWpcSystem;
  const initObject = {
    closedSwitches: [ 16, 17, 18 ],
  };
  return initialiseActions(initObject, mockWpcSystem)
    .then(() => {
      t.deepEqual(t.context.data.inputData, initObject.closedSwitches);
    });
});

test('initialiseActions, should init initialAction', (t) => {
  const mockWpcSystem = t.context.mockWpcSystem;
  const initObject = {
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  };
  return initialiseActions(initObject, mockWpcSystem)
    .then(() => {
      t.deepEqual(t.context.data.inputDataCabinet, [16]);
    });
});
