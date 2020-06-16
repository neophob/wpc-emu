'use strict';

const test = require('ava');
const gamelist = require('../../../lib/db');

test('gamelist, should getAllNames', (t) => {
  const result = gamelist.getAllNames();
  t.is(result.length > 20, true);
});

test('gamelist, should getByName', (t) => {
  const NAME = 'WPC-DMD: Terminator 2';
  const result = gamelist.getByName(NAME);
  t.is(result.name, NAME);
  t.is(result.version, 'L-8');
});

test('gamelist, should getByPinmameName', (t) => {
  const result = gamelist.getByPinmameName('tz_94h');
  t.is(result.pinmame.gameName, 'Twilight Zone');
});

test('gamelist, should getByPinmameName (UPPERCASE)', (t) => {
  const result = gamelist.getByPinmameName('TZ_94H');
  t.is(result.pinmame.gameName, 'Twilight Zone');
});

test('gamelist, getByPinmameName with unknown name', (t) => {
  const result = gamelist.getByPinmameName('i do not exist!');
  t.is(result, undefined);
});
