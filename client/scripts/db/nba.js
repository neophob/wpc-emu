'use strict';

module.exports = {
  name: 'WPC-95: NBA Fastbreak',
  version: '3.1',
  rom: {
    u06: 'fb_g11.3_1',
  },
  switchMapping: [
    { id: 11, name: 'BALL LAUNCHER' },
    { id: 12, name: 'BACKBOX BASKET' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOOTER LANE' },
    { id: 16, name: 'LT RETURN LANE' },
    { id: 17, name: 'RT RETURN LANE' },
    { id: 18, name: 'L R STANDUP' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'RIGHT JET' },
    { id: 25, name: 'EJECT HOLE' },
    { id: 26, name: 'LEFT OUT LANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'U R STANDUP' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'CENTER RAMP OPTO' },
    { id: 37, name: 'R LOOP ENT OPTO' },
    { id: 38, name: 'RIGHT LOOP EXIT' },

    { id: 41, name: 'STANDUP "3"' },
    { id: 42, name: 'STANDUP "P"' },
    { id: 43, name: 'STANDUP "T"' },
    { id: 44, name: 'RIGHT RAMP ENTER' },
    { id: 45, name: 'LEFT RAMP ENTER' },
    { id: 46, name: 'LEFT RAMP MADE' },
    { id: 47, name: 'LEFT LOOP ENTER' },
    { id: 48, name: 'LEFT LOOP MADE' },

    { id: 51, name: 'DEFENDER POS 4' },
    { id: 52, name: 'DEFENDER POS 3' },
    { id: 53, name: 'DEFEND LOCK POS' },
    { id: 54, name: 'DEFENDER POS 2' },
    { id: 55, name: 'DEFENDER POS 1' },
    { id: 56, name: 'JETS BALL DRAIN' },
    { id: 57, name: 'L SLINGSHOT' },
    { id: 58, name: 'R SLINGSHOT' },

    { id: 61, name: 'LEFT JET' },
    { id: 62, name: 'MIDDLE JET' },
    { id: 63, name: 'L LOOP RAMP EXIT' },
    { id: 64, name: 'RIGHT RAMP MADE' },
    { id: 65, name: '"IN THE PAINT" 4' },
    { id: 66, name: '"IN THE PAINT" 3' },
    { id: 67, name: '"IN THE PAINT" 2' },
    { id: 68, name: '"IN THE PAINT" 1' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'BASKED MADE' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'BASKED HOLD' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-nba.jpg',
  },
  skipWmcRomCheck: true,
  features: [
    'securityPic',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 51, 52, 53, 54, 55
      31, 36, 37, 51, 52, 53, 54, 55,
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
