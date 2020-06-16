'use strict';

const test = require('ava');
const Emulator = require('../../index');

test('GamelistDB should return all included game entries', (t) => {
  const gameListArray = Emulator.GamelistDB.getAllNames();
  t.is(gameListArray.length > 60, true);
});

test('GamelistDB should get pinmame game entry', (t) => {
  const gameEntry = Emulator.GamelistDB.getByPinmameName('mm_109b');
  t.is(gameEntry.name, 'WPC-95: Medieval Madness');
});
