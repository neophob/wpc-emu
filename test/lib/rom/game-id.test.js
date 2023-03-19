const test = require('ava');
const gameId = require('../../../lib/rom/game-id');

const MAGIC_STRING = [
  // MAGIC PREFIX
  0xEC,
  0x9F,

  //POSITION
  0x80,
  0x00,

  // MAGIC POSTFIX
  0x83,
  0x12,
  0x34,
  0, 0, 0, 0, 0, 0, 0
];

test('gameId.search should return undefined if magix byte found', (t) => {
  const result = gameId.search([], []);
  t.is(result, undefined);
});

test('gameId.search should ignore magic byte if only found once', (t) => {
  const result = gameId.search(MAGIC_STRING, []);
  t.is(result, undefined);
});

test('gameId.search should find magic byte', (t) => {
  const gameRom = [].concat(MAGIC_STRING).concat(MAGIC_STRING);
  const systemRom = [0x11, 0x22];
  const result = gameId.search(gameRom, systemRom);
  t.is(result, 0x1122);
});
