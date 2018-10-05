'use strict';

import test from 'ava';
import gameId from '../../../lib/rom/game-id';

test('gameId.search should return undefined if nothing found', (t) => {
  const result = gameId.search([],[]);
  t.is(result, undefined);
});
