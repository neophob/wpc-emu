'use strict';

import addams from './addams';
import congo from './congo';
import cv from './cv';
import dh from './dh';
import dw from './dw';
import fishtales from './fishtales';
import flintstones from './flintstones';
import gilligan from './gilligan';
import highspeed2 from './highspeed2';
import hotshot from './hotshot';
import hurricane from './hurricane';
import indianajones from './indianajones';
import jm from './jm';
import mm from './mm';
import nofear from './nofear';
import sc from './sc';
import sttng from './sttng';
import t2Freewpc from './t2.freewpc';
import t2 from './t2';
import tom from './tom';
import tpz from './tpz';
import tz from './tz';
import wpcTestrom from './wpc.testrom';

export { getAllNames, getByName };

const wpcGames = [
  addams,
  cv,
  congo,
  dw,
  dh,
  fishtales,
  flintstones,
  gilligan,
  highspeed2,
  hotshot,
  hurricane,
  indianajones,
  jm,
  mm,
  nofear,
  sc,
  sttng,
  t2Freewpc,
  t2,
  tom,
  tpz,
  tz,
  wpcTestrom,
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
