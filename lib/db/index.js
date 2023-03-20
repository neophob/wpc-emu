const addamsFamily = require('./taf');
const addamsFamilyValues = require('./afv');
const attackFromMars = require('./afm');
const attackFromMarsFreewpc = require('./afm.freewpc');
const blackRose = require('./br');
const bramStokersDracula = require('./bsd');
const cactusCanyon = require('./cc');
const cirqusVoltaire = require('./cv');
const congo = require('./congo');
const corvette = require('./corv');
const corvetteFreewpc = require('./corv.freewpc');
const creatureFromTheBlackLagoon = require('./cftbl');
const demolitionMan = require('./dm');
const demolitionManFreewpc = require('./dm.freewpc');
const dirtyHarry = require('./dh');
const drDude = require('./drdude');
const drWho = require('./dw');
const funhouse = require('./fh');
const funhouseFreeWpc = require('./fh.freewpc');
const fishTales = require('./fishtales');
const gilligansIsland = require('./gilligan');
const harly = require('./harly');
const highSpeed2TheGetaway = require('./highspeed2');
const hotShotBasketball = require('./hotshot');
const hurricane = require('./hurricane');
const indianapolis500 = require('./i500');
const indianaJonesThePinballAdventure = require('./indianajones');
const jackBot = require('./jb');
const judgeDredd = require('./jd');
const junkYard = require('./jy');
const johnnyMnemonic = require('./jm');
const leagueChamp = require('./lc');
const monsterBash = require('./mb');
const medievalMadness = require('./mm');
const nbaFastbreak = require('./nba');
const noFear = require('./nofear');
const noGoodGofers = require('./ngg');
const popeyeSavesTheEarth = require('./pste');
const redTedsRoadShow = require('./rtrs');
const safeCracker = require('./sc');
const scaredStiff = require('./ss');
const slugFest = require('./sf');
const starTrekTheNextGeneration = require('./sttng');
const strikeMaster = require('./sm');
const talesOfTheArabianNights = require('./totan');
const theMachineBrideOfPinbot = require('./tmbop');
const terminator2Freewpc = require('./t2.freewpc');
const terminator2 = require('./t2');
const ticketTacToe = require('./ttt');
const theatreOfMagic = require('./tom');
const theAddamsFamilySpecial = require('./addams');
const theChampionPub = require('./tcp');
const theFlintstones = require('./flintstones');
const thePartyZone = require('./tpz');
const theShadow = require('./ts');
const twilightZone = require('./tz');
const twilightZoneFreewpc = require('./tz.freewpc');
const whiteWater = require('./ww');
const whiteWaterFreewpc = require('./ww.freewpc');
const whoDunnit = require('./wd');
const worldCupSoccer = require('./wcs');
const worldCupSoccerFreewpc = require('./wcs.freewpc');
const wpcTestrom = require('./wpc.testrom');
const wpcAlphaTestrom = require('./wpca.testrom');
const wpc95Testrom = require('./wpc95.testrom');
const wpcSTestrom = require('./wpcs.testrom');
const uploadWpcAlpha = require('./wpca.upload');
const uploadWpc = require('./wpc.upload');
const uploadWpcFlip = require('./wpcFlip.upload');
const uploadWpcS = require('./wpcs.upload');
const uploadWpc95 = require('./wpc95.upload');

module.exports = {
  getAllNames,
  getByName,
  getByPinmameName,
};

const wpcGames = [
  addamsFamily,
  addamsFamilyValues,
  attackFromMars,
  attackFromMarsFreewpc,
  blackRose,
  bramStokersDracula,
  cactusCanyon,
  cirqusVoltaire,
  congo,
  corvette,
  corvetteFreewpc,
  creatureFromTheBlackLagoon,
  demolitionMan,
  demolitionManFreewpc,
  dirtyHarry,
  drDude,
  drWho,
  fishTales,
  funhouse,
  funhouseFreeWpc,
  gilligansIsland,
  harly,
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
  theMachineBrideOfPinbot,
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
  worldCupSoccerFreewpc,
  wpcTestrom,
  wpcAlphaTestrom,
  wpc95Testrom,
  wpcSTestrom,
  uploadWpcAlpha,
  uploadWpc,
  uploadWpcFlip,
  uploadWpcS,
  uploadWpc95,
];

function getAllNames() {
  return wpcGames
    .filter((entry) => entry.rom && entry.rom.u06)
    .map((entry) => entry.name)
    .sort();
}

function getByName(name) {
  return wpcGames.find((entry) => entry.name === name);
}

function getByPinmameName(filename) {
  return wpcGames.find((entry) => entry.pinmame && entry.pinmame.knownNames.includes(filename.toLowerCase()))
}
