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

let overallSupportLevel = 0;

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

  overallSupportLevel += supportLevel;

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
const percentageSupport = (100 / (gameSummary.length * 4)) * overallSupportLevel;
console.error('Overall Support Level', overallSupportLevel, '(' + percentageSupport + '%)' );
console.error();
