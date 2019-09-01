'use strict';

import * as gamelist from '../../client/scripts/db/gamelist';

const gameNames = gamelist.getAllNames();
const gameSummary = gameNames.map((name) => {
  const gameEntry = gamelist.getByName(name);
  return {
    name: gameEntry.name,
    switchMapping: gameEntry.switchMapping ? true : false,
    playfield: gameEntry.playfield ? true : false,
    audio: gameEntry.audio ? true : false,
    memoryPosition: gameEntry.memoryPosition ? true : false,
  }
});

console.error('| Game | Summary | Switch Mapping | Playfield Support | Audio Support | Memory Position');
console.error('| --- | --- | --- | --- | --- | --- |');

gameSummary.forEach((entry) => {
  let supportLevel = 0;
  if (entry.switchMapping) {
    supportLevel++;
  }
  if (entry.playfield) {
    supportLevel++;
  }
  if (entry.audio) {
    supportLevel++;
  }
  if (entry.audio) {
    supportLevel++;
  }
  console.error(
    '|',
    entry.name,
    '|',
    supportLevel,
    '|',
    entry.switchMapping ? '**✓**' : '✗',
    '|',
    entry.playfield ? '**✓**' : '✗',
    '|',
    entry.audio ? '**✓**' : '✗',
    '|',
    entry.audio ? '**✓**' : '✗',
    '|',
  );
});
console.error();
