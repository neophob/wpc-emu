'use strict';

import test from 'ava';
import * as gamelist from '../../../scripts/db/gamelist';

test('gamelist, should getAllNames', (t) => {
  const result = gamelist.getAllNames();
  t.is(result.length, 14);
});

test('gamelist, should getByName', (t) => {
  const NAME = 'Terminator 2';
  const result = gamelist.getByName(NAME);
  t.is(result.name, NAME);
  t.is(result.version, 'L-8');
});
