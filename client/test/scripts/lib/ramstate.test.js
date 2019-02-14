'use strict';

import test from 'ava';
import { loadRam, saveRam } from '../../../scripts/lib/ramState';

test.beforeEach((t) => {
  function storageMock() {
    var storage = {};

    return {
      setItem: (key, value) => {
        storage[key] = value || '';
      },
      getItem: (key) => {
        return key in storage ? storage[key] : null;
      },
    };
  }

  const localStorage = storageMock();
  global.window = {
    localStorage,
  };

  let state;

  const mockWpcSystem = {
    cpuBoard: {
      romFileName: 'mockedName',
      getState: () => {
        return {
          foo: 'bar',
          nested: {
            data: 123,
            moreNested: {
              thats: 'deep',
            }
          },
          convertMe: Uint8Array.from([1,2,3]),
        };
      },
      setState: (_state) => {
        state = _state;
      },
    }
  };

  t.context = {
    localStorage: global.window.localStorage,
    mockWpcSystem,
    spySetState: () => {
      return state;
    },
  };
});

test('loadRam, should ignore non existent ram state', (t) => {
  const loadedEntry = loadRam(t.context.mockWpcSystem);
  t.is(loadedEntry, false);
});

test('saveRam, should ignore non existent ram state', (t) => {
  saveRam(t.context.mockWpcSystem);
  const result = t.context.localStorage.getItem('mockedName');
  t.deepEqual(result, '{"foo":"bar","nested":{"data":123,"moreNested":{"thats":"deep"}},"convertMe":[1,2,3]}');
});

test('saveRam/loadRam, should populate wpc system with new data', (t) => {
  saveRam(t.context.mockWpcSystem);
  const loadedEntry = loadRam(t.context.mockWpcSystem);
  const result = t.context.spySetState();
  t.is(loadedEntry, true);
  t.deepEqual(result, {
    foo: 'bar',
    nested: {
      data: 123,
      moreNested: { thats: 'deep' }
    },
    convertMe: [ 1, 2, 3 ]
  });
});
