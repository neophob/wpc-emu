'use strict';

// function to convert 16 bit dcs sound volume to an absolute volume
// found values when set on screen volumes and dump commands, eg: "SET_GLOBAL_VOLUME_TO 47b8"

module.exports = {
  getRelativeVolume,
};

function getRelativeVolume(volumeCommand) {
  switch (volumeCommand) {
    case 0x00FF:
      return 0;
    case 0x0FF0:
      return 1;
    case 0x17E8:
      return 2;
    case 0x1FE0:
      return 3;
    case 0x27D8:
      return 4;
    case 0x2FD0:
      return 5;
    case 0x37C8:
      return 6;
    case 0x3FC0:
      return 7;
    case 0x47B8:
      return 8;
    case 0x4FB0:
      return 9;
    case 0x57A8:
      return 10;
    case 0x5FA0:
      return 11;
    case 0x6798:
      return 12;
    case 0x6F90:
      return 13;
    case 0x7788:
      return 14;
    case 0x7F80:
      return 15;
    case 0x8778:
      return 16;
    case 0x8F70:
      return 17;
    case 0x9768:
      return 18;
    case 0x9F60:
      return 19;
    case 0xA758:
      return 20;
    case 0xAF50:
      return 21;
    case 0xB748:
      return 22;
    case 0xBF40:
      return 23;
    case 0xC738:
      return 24;
    case 0xCF30:
      return 25;
    case 0xD728:
      return 26;
    case 0xDF20:
      return 27;
    case 0xE718:
      return 28;
    case 0xEF10:
      return 29;
    case 0xF708:
      return 30;
    case 0xFF00:
      return 31;
    default:
      console.log('WARNING, UNKNOWN VOLUME FOUND:', volumeCommand);
      return 11;
  }
}
