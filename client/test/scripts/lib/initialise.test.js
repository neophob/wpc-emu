import test from 'ava';
import { initialiseActions } from '../../../scripts/lib/initialise.js';

test.beforeEach(t => {
  const data = {
    inputData: [],
    inputDataCabinet: [],
  };
  const mockWpcSystem = {
    setSwitchInput(id) {
      data.inputData.push(id);
    },
    setCabinetInput(id) {
      data.inputDataCabinet.push(id);
    },
  };
  t.context = {
    mockWpcSystem,
    data,
  };
});

test('initialiseActions, should return resolved promise', t => {
  initialiseActions()
    .then(value => {
      t.is(value, undefined);
    });
});

test('initialiseActions, should init closedSwitches', t => {
  const mockWpcSystem = t.context.mockWpcSystem;
  const initObject = {
    closedSwitches: [16, 17, 18],
  };
  return initialiseActions(initObject, mockWpcSystem)
    .then(() => {
      t.deepEqual(t.context.data.inputData, initObject.closedSwitches);
    });
});

test('initialiseActions, should init initialAction', t => {
  const mockWpcSystem = t.context.mockWpcSystem;
  const initObject = {
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16,
      },
    ],
  };
  return initialiseActions(initObject, mockWpcSystem)
    .then(() => {
      t.deepEqual(t.context.data.inputDataCabinet, [16]);
    });
});
