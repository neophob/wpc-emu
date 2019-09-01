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
      playfieldLamps: gameEntry.playfield && gameEntry.playfield.lamps ? true : false,
      playfieldFlashLamps: gameEntry.playfield && gameEntry.playfield.flashlamps ? true : false,
      audio: gameEntry.audio ? true : false,
      memoryPosition: gameEntry.memoryPosition,
    }
  });

const FIELDS_NR = 6;
const OK = '✅';
const NOK = '❌';
const elementsCounter = [0, 0, 0, 0, 0, 0];
let overallSupportLevel = 0;

console.error('| Game | Summary | Switch Mapping | Playfield Image | Playfield Lamps | Playfield Flashlamps | Audio Support | Memory Position |');
console.error('| --- | --- | --- | --- | --- | --- | --- | --- |');

gameSummary.forEach((entry) => {
  let supportLevel = 0;

  const memoryPosition = entry.memoryPosition && entry.memoryPosition.length;

  if (entry.switchMapping) {
    elementsCounter[0]++;
    supportLevel++;
  }
  if (entry.playfield) {
    elementsCounter[1]++;
    supportLevel++;
  }
  if (entry.playfieldLamps) {
    elementsCounter[2]++;
    supportLevel++;
  }
  if (entry.playfieldFlashLamps) {
    elementsCounter[3]++;
    supportLevel++;
  }
  if (entry.audio) {
    elementsCounter[4]++;
    supportLevel++;
  }
  if (memoryPosition) {
    elementsCounter[5]++;
    supportLevel++;
  }

  overallSupportLevel += supportLevel;

  console.error(
    '|',
    entry.name,
    '|',
    supportLevel,
    '|',
    entry.switchMapping ? OK : NOK,
    '|',
    entry.playfield ? OK : NOK,
    '|',
    entry.playfieldLamps ? OK : NOK,
    '|',
    entry.playfieldFlashLamps ? OK : NOK,
    '|',
    entry.audio ? OK : NOK,
    '|',
    memoryPosition ? OK + ' (' + entry.memoryPosition.length + ')' : NOK,
    '|',
  );
});

const percentageSupport = parseInt((100 / (gameSummary.length * FIELDS_NR)) * overallSupportLevel + 0.5);

console.error(
  '| **Total** |',
  '' + overallSupportLevel + ' (' + percentageSupport + '%)',
  '|',
  elementsCounter[0],
  '|',
  elementsCounter[1],
  '|',
  elementsCounter[2],
  '|',
  elementsCounter[3],
  '|',
  elementsCounter[4],
  '|',
  elementsCounter[5],
  '|',
);

console.error();
