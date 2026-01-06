import test from 'ava';
import { loadRam, saveRam } from '../../../scripts/lib/ramState.js';

test.beforeEach(t => {
  function storageMock() {
    var storage = {};

    return {
      setItem(key, value) {
        storage[key] = value || '';
      },
      getItem(key) {
        return key in storage ? storage[key] : null;
      },
    };
  }

  const localStorage = storageMock();
  global.window = {
    localStorage,
  };
  global.localStorage = localStorage;

  t.context = {
    localStorage,
  };
});

test.serial('loadRam, should ignore non existent ram state', t => {
  const loadedEntry = loadRam('foo');
  t.is(loadedEntry, false);
});

test.serial('saveRam, should ignore non existent ram state', t => {
  const filename = 'foobar';
  const state = { is: true };
  saveRam(filename, state);
  const result = t.context.localStorage.getItem(filename);
  t.deepEqual(result, JSON.stringify(state));
});

test.serial('saveRam/loadRam, load state should equal the initial state', t => {
  const filename = 'foobar';
  const state = {
    is: true,
    moreNested: { thats: 'deep' },
    convertMe: [1, 2, 3],
  };
  saveRam(filename, state);

  const result = loadRam(filename);
  t.deepEqual(result, state);
});
