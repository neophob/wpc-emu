'use strict';

import addams from './addams';
//import dh from './dh';
import dw from './dw';
import fishtales from './fishtales';
import gilligan from './gilligan';
import highspeed2 from './highspeed2';
import hotshot from './hotshot';
import hurricane from './hurricane';
import indianajones from './indianajones';
import mm from './mm';
import t2Freewpc from './t2.freewpc';
import t2 from './t2';
import tpz from './tpz';
import tz from './tz';

export { getAllNames, getByName };

const wpcGames = [
  addams,
  dw,
//  dh,
  fishtales,
  gilligan,
  highspeed2,
  hotshot,
  hurricane,
  indianajones,
  mm,
  t2Freewpc,
  t2,
  tpz,
  tz,
];

function getAllNames() {
  return wpcGames
    .filter((entry) => {
      return entry.rom && entry.rom.u06;
    })
    .map((entry) => entry.name);
}

function getByName(name) {
  return wpcGames.find((entry) => entry.name === name);
}

// HINT: make sure CORS is correct
