'use strict';

const fetch = require('node-fetch');
import * as gamelist from '../../client/scripts/db';

const gameNames = gamelist.getAllNames();
const gameSummary = gameNames
  .filter(name => !name.startsWith('UPLOAD'))
  .map((name) => gamelist.getByName(name));

gameSummary.forEach((entry) => {
  checkAvailableRoms(entry);
});


function checkAvailableRoms(entry) {
  const URL = buildVpdbUrl(entry.pinmame.vpdbId || entry.pinmame.id);
  return fetch(URL)
    .then(res => res.json())
    .then((romDataFromVpdb) => {
      checkForRoms(entry.name, entry.pinmame.knownNames, romDataFromVpdb);
    });
}

function buildVpdbUrl(id) {
  return `https://api.vpdb.io/v1/games/${id}/roms/`;
}

function checkForRoms(gameName, arrayOfRequiredROMs, jsonFromVpdb) {
  if (!Array.isArray(jsonFromVpdb)) {
    console.log(gameName, '- ERROR!');
    return;
  }
  arrayOfRequiredROMs.forEach((name) => {
    const result = jsonFromVpdb.find((element) => {
      return element.id === name;
    });
    console.log(gameName, ' -', name + ':', result ? '✅' : '❌');
  });
}
