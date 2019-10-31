'use strict';

module.exports = {
  name: 'WPC-S: WHO Dunnit',
  version: '1.2',
  pinmame: {
    knownNames: [ 'wd_03r', 'wd_048r', 'wd_10r', 'wd_10g', 'wd_10f', 'wd_11', 'wd_12', 'wd_12g' ],
    gamename: 'WHO Dunnit',
    id: 'wd',
  },
  rom: {
    u06: 'whod1_2.rom',
  },
  switchMapping: [
    { id: 11, name: '3 BANK POS 2' },
    { id: 12, name: 'SLOT INDEX LEFT' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOOTER LANE' },
    { id: 16, name: 'RIGHT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'RIGHT LOOP' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY IN BUTTON' },
    { id: 25, name: 'SLOT INDEX CNTR' },
    { id: 26, name: 'LEFT INLANE' },
    { id: 27, name: 'LEFT OUTLANE' },
    { id: 28, name: 'LEFT LOOP' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 36, name: 'ENTER RAMP' },
    { id: 37, name: 'MADE RAMP LEFT' },

    { id: 41, name: 'TOP LEFT HOLE' },
    { id: 42, name: 'POST JETS' },
    { id: 43, name: 'BCK RIGHT POPPER' },
    { id: 44, name: 'LOW RIGHT POPPER' },
    { id: 47, name: 'EXTRA RIGHT HOLE' },
    { id: 48, name: 'SLOT INDEX RIGHT' },

    { id: 51, name: 'LOCK UP 1' },
    { id: 52, name: 'TOP 4 BANK' },
    { id: 53, name: '2ND 4 BANK' },
    { id: 54, name: '3RD 4 BANK' },
    { id: 55, name: 'BOT 4 BANK' },
    { id: 56, name: 'MYSTERY TARGET' },
    { id: 57, name: 'LOW RT LOCK 2' },
    { id: 58, name: 'RED' },

    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGHT SLING' },
    { id: 63, name: 'LEFT JET' },
    { id: 64, name: 'BOTTOM JET' },
    { id: 65, name: 'RIGHT JET' },
    { id: 66, name: 'LEFT 3 BANK' },
    { id: 67, name: 'CENTER 3 BANK' },
    { id: 68, name: 'RIGHT 3 BANK' },

    { id: 71, name: 'TOP 2 BANK' },
    { id: 72, name: 'BOT 2 BANK' },
    { id: 73, name: '3 BANKS POS UP' },
    { id: 74, name: 'UP DN RAMP' },
    { id: 75, name: 'SCOOP CENTER' },
    { id: 76, name: 'SCOOP RIGHT' },
    { id: 77, name: 'SCOOP LEFT' },
    { id: 78, name: 'BLACK' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'SPINNER' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-wd.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 47, 48, 51, 52, 53
      31, 36, 37, 41, 42, 43, 44, 47, 48, 51, 52, 53,
      'F2', 'F4', 'F6', 'F8',
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  }
};
