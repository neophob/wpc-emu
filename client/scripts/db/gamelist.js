'use strict';

import addamsFamilyValues from './afv';
import attackFromMars from './afm';
import attackFromMarsFreewpc from './afm.freewpc';
import blackRose from './br';
import bramStokersDracula from './bsd';
import cactusCanyon from './cc';
import cirqusVoltaire from './cv';
import congo from './congo';
import corvette from './corv';
import creatureFromTheBlackLagoon from './cftbl';
import demolitionMan from './dm';
import demolitionManFreewpc from './dm.freewpc';
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
import leagueChamp from './lc';
import monsterBash from './mb';
import medievalMadness from './mm';
import nbaFastbreak from './nba';
import noFear from './nofear';
import noGoodGofers from './ngg';
import popeyeSavesTheEarth from './pste';
import redTedsRoadShow from './rtrs';
import safeCracker from './sc';
import scaredStiff from './ss';
import slugFest from './sf';
import starTrekTheNextGeneration from './sttng';
import strikeMaster from './sm';
import talesOfTheArabianNights from './totan';
import terminator2Freewpc from './t2.freewpc';
import terminator2 from './t2';
import ticketTacToe from './ttt';
import theatreOfMagic from './tom';
import theAddamsFamilySpecial from './addams';
import theChampionPub from './tcp';
import theFlintstones from './flintstones';
import thePartyZone from './tpz';
import theShadow from './ts';
import twilightZone from './tz';
import twilightZoneFreewpc from './tz.freewpc';
import whiteWater from './ww';
import whiteWaterFreewpc from './ww.freewpc';
import whoDunnit from './wd';
import worldCupSoccer from './wcs';
import wpcTestrom from './wpc.testrom';
import wpc95Testrom from './wpc95.testrom';
import wpcSTestrom from './wpcs.testrom';

export { getAllNames, getByName };

const wpcGames = [
  addamsFamilyValues,
  attackFromMars,
  attackFromMarsFreewpc,
  blackRose,
  bramStokersDracula,
  cactusCanyon,
  cirqusVoltaire,
  congo,
  corvette,
  creatureFromTheBlackLagoon,
  demolitionMan,
  demolitionManFreewpc,
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
  leagueChamp,
  monsterBash,
  medievalMadness,
  nbaFastbreak,
  noGoodGofers,
  noFear,
  popeyeSavesTheEarth,
  redTedsRoadShow,
  safeCracker,
  scaredStiff,
  slugFest,
  starTrekTheNextGeneration,
  strikeMaster,
  talesOfTheArabianNights,
  terminator2Freewpc,
  terminator2,
  theatreOfMagic,
  theAddamsFamilySpecial,
  theChampionPub,
  theFlintstones,
  thePartyZone,
  theShadow,
  ticketTacToe,
  twilightZone,
  twilightZoneFreewpc,
  whiteWater,
  whiteWaterFreewpc,
  whoDunnit,
  worldCupSoccer,
  wpcTestrom,
  wpc95Testrom,
  wpcSTestrom,
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
