'use strict';

import addamsFamilyValues from './afv';
import attackFromMars from './afm';
import blackRose from './br';
import bramStokersDracula from './bsd';
import cactusCanyon from './cc';
import cirqusVoltaire from './cv';
import congo from './congo';
import creatureFromTheBlackLagoon from './cftbl';
import demolitionMan from './dm';
import dirtyHarry from './dh';
import drWho from './dw';
import fishTales from './fishtales';
import gilligansIsland from './gilligan';
import highSpeed2TheGetaway from './highspeed2';
import hotShotBasketball from './hotshot';
import hurricane from './hurricane';
import indianapolis500 from './i500';
import indianaJonesThePinballAdventure from './indianajones';
import jackBot from './jb';
import judgeDredd from './jd';
import junkYard from './jy';
import johnnyMnemonic from './jm';
import monsterBash from './mb';
import medievalMadness from './mm';
import nbaFastbreak from './nba';
import noFear from './nofear';
import noGoodGofers from './ngg';
import popeyeSavesTheEarth from './pste';
import safeCracker from './sc';
import scaredStiff from './ss';
import slugFest from './sf';
import starTrekTheNextGeneration from './sttng';
import talesOfTheArabianNights from './totan';
import terminator2Freewpc from './t2.freewpc';
import terminator2 from './t2';
import ticketTacToe from './ttt';
import theatreOfMagic from './tom';
import theAddamsFamilySpecial from './addams';
import theChampionPub from './tcp';
import theFlintstones from './flintstones';
import thePartyZone from './tpz';
import twilightZone from './tz';
import whiteWater from './ww';
import whoDunnit from './wd';
import worldCupSoccer from './wcs';
import wpcTestrom from './wpc.testrom';

export { getAllNames, getByName };

const wpcGames = [
  addamsFamilyValues,
  attackFromMars,
  blackRose,
  bramStokersDracula,
  cactusCanyon,
  cirqusVoltaire,
  congo,
  creatureFromTheBlackLagoon,
  demolitionMan,
  dirtyHarry,
  drWho,
  fishTales,
  gilligansIsland,
  highSpeed2TheGetaway,
  hotShotBasketball,
  hurricane,
  indianapolis500,
  indianaJonesThePinballAdventure,
  jackBot,
  judgeDredd,
  junkYard,
  johnnyMnemonic,
  monsterBash,
  medievalMadness,
  nbaFastbreak,
  noGoodGofers,
  noFear,
  popeyeSavesTheEarth,
  safeCracker,
  scaredStiff,
  slugFest,
  starTrekTheNextGeneration,
  talesOfTheArabianNights,
  terminator2Freewpc,
  terminator2,
  theatreOfMagic,
  theAddamsFamilySpecial,
  theChampionPub,
  theFlintstones,
  thePartyZone,
  ticketTacToe,
  twilightZone,
  whiteWater,
  whoDunnit,
  worldCupSoccer,
  wpcTestrom,
];

function getAllNames() {
  return wpcGames
    .filter((entry) => {
      return entry.rom && entry.rom.u06;
    })
    .map((entry) => entry.name)
    .sort();
}

function getByName(name) {
  return wpcGames.find((entry) => entry.name === name);
}

// HINT: make sure CORS is correct
