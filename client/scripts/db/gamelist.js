'use strict';

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
import indianaJonesThePinballAdventure from './indianajones';
import judgeDredd from './jd';
import johnnyMnemonic from './jm';
import monsterBash from './mb';
import medievalMadness from './mm';
import noFear from './nofear';
import noGoodGofers from './ngg';
import popeyeSavesTheEarth from './pste';
import scaredStiff from './ss';
import starTrekTheNextGeneration from './sttng';
import talesOfTheArabianNights from './totan';
import terminator2Freewpc from './t2.freewpc';
import terminator2 from './t2';
import theatreOfMagic from './tom';
import theAddamsFamilySpecial from './addams';
import theFlintstones from './flintstones';
import thePartyZone from './tpz';
import twilightZone from './tz';
import whiteWater from './ww';
import wpcTestrom from './wpc.testrom';

export { getAllNames, getByName };

const wpcGames = [
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
  indianaJonesThePinballAdventure,
  judgeDredd,
  johnnyMnemonic,
  monsterBash,
  medievalMadness,
  noGoodGofers,
  noFear,
  popeyeSavesTheEarth,
  scaredStiff,
  starTrekTheNextGeneration,
  talesOfTheArabianNights,
  terminator2Freewpc,
  terminator2,
  theatreOfMagic,
  theAddamsFamilySpecial,
  theFlintstones,
  thePartyZone,
  twilightZone,
  whiteWater,
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
