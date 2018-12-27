'use strict';

import addams from './addams';
import afm from './afm';
import bsd from './bsd';
import congo from './congo';
import cc from './cc';
import cftbl from './cftbl';
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
import mb from './mb';
import mm from './mm';
import nofear from './nofear';
import ngg from './ngg';
import sc from './sc';
import sttng from './sttng';
import t2Freewpc from './t2.freewpc';
import t2 from './t2';
import tom from './tom';
import totan from './totan';
import tpz from './tpz';
import tz from './tz';
import wpcTestrom from './wpc.testrom';
import ww from './ww';

export { getAllNames, getByName };

const wpcGames = [
  addams,
  afm,
  bsd,
  cc,
  cftbl,
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
  mb,
  mm,
  ngg,
  nofear,
  sc,
  sttng,
  t2Freewpc,
  t2,
  tom,
  totan,
  tpz,
  tz,
  wpcTestrom,
  ww,
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
