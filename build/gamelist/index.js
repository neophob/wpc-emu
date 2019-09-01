'use strict';

import * as gamelist from '../../client/scripts/db/gamelist';

const gameNames = gamelist.getAllNames();
const gameSummary = gameNames
  .filter(name => !name.startsWith('UPLOAD'))
  .map((name) => {
    const gameEntry = gamelist.getByName(name);
    return {
      name: gameEntry.name,
      switchMapping: gameEntry.switchMapping ? true : false,
      playfield: gameEntry.playfield ? true : false,
      audio: gameEntry.audio ? true : false,
      memoryPosition: gameEntry.memoryPosition,
    }
  });

console.error('| Game | Summary | Switch Mapping | Playfield Support | Audio Support | Memory Position');
console.error('| --- | --- | --- | --- | --- | --- |');

gameSummary.forEach((entry) => {
  let supportLevel = 0;

  const memoryPosition = entry.memoryPosition && entry.memoryPosition.length;

  if (entry.switchMapping) {
    supportLevel++;
  }
  if (entry.playfield) {
    supportLevel++;
  }
  if (entry.audio) {
    supportLevel++;
  }
  if (memoryPosition) {
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
    memoryPosition
      ? '**✓**' + ' (' + entry.memoryPosition.length + ')'
      : '✗',
    '|',
  );
});
console.error();
