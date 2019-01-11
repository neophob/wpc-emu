'use strict';

module.exports = {
  name: 'WPC-95: Medieval Madness',
  version: 'L-8',
  rom: {
    u06: 'mm_109b.bin',
  },
  switchMapping: [
    { id: 11, name: 'LAUNCH BUTTON' },
    { id: 12, name: 'CATAPULT TARGET' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'L TROLL TARGET' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT RETURN' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 25, name: 'R TROLL TARGET' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'RIGHT EJECT' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LEFT POPPER' },
    { id: 37, name: 'CASTLE GATE' },
    { id: 38, name: 'CATAPULT' },

    { id: 41, name: 'MOAT ENTER' },
    { id: 44, name: 'CASTLE LOCK' },
    { id: 45, name: 'L TROLL (U/PLDF)' },
    { id: 46, name: 'R TROLL (U/PLDF)' },
    { id: 47, name: 'LEFT TOP LANE' },
    { id: 48, name: 'RIGHT TOP LANE' },

    { id: 51, name: 'LEFT SLINGSHOT' },
    { id: 52, name: 'RIGHT SLINGSHOT' },
    { id: 53, name: 'LEFT JET' },
    { id: 54, name: 'BOTTOM JET' },
    { id: 55, name: 'RIGHT JET' },
    { id: 56, name: 'DRAWBRIDGE UP' },
    { id: 57, name: 'DRAWBRIDGE DOWN' },
    { id: 58, name: 'TOWER EXIT' },

    { id: 61, name: 'L RAMP ENTER' },
    { id: 62, name: 'L RAMP EXIT' },
    { id: 63, name: 'R RAMP ENTER' },
    { id: 64, name: 'R RAMP EXIT' },
    { id: 65, name: 'LEFT LOOP LO' },
    { id: 66, name: 'LEFT LOOP HI' },
    { id: 67, name: 'RIGHT LOOP LO' },
    { id: 68, name: 'RIGHT LOOP HI' },

    { id: 71, name: 'RIGHT BANK TOP' },
    { id: 72, name: 'RIGHT BANK MID' },
    { id: 73, name: 'RIGHT BANK BOT' },
    { id: 74, name: 'L TROLL UP' },
    { id: 75, name: 'R TROLL UP' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  skipWmcRomCheck: true,
  features: [
    'securityPic',
  ],
  initialise: {
    closedSwitches: [
      22, 56,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41,
      31, 36, 37, 41,
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
