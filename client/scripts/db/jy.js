'use strict';

module.exports = {
  name: 'WPC-95: Junk Yard',
  version: '1.2',
  rom: {
    u06: 'jy_g11.1_2',
  },
  switchMapping: [
    { id: 11, name: 'TOASTER GUN' },
    { id: 12, name: 'REBOUND SW' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'TOP LEFT CRANE' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'LEFT RETURN LANE' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 26, name: 'RIGHT RETURN LANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'CRANE DOWN' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LOCK UP 2' },
    { id: 37, name: 'LOCK UP 1' },
    { id: 38, name: 'TOP RIGHT CRANE' },

    { id: 41, name: 'PAST SPINNER' },
    { id: 42, name: 'IN THE SEWER' },
    { id: 43, name: 'LOCK JAM' },
    { id: 44, name: 'PAST CRANE' },
    { id: 45, name: 'RAMP EXIT' },
    { id: 46, name: 'CAR TARG 1 LEFT' },
    { id: 47, name: 'CAR TARG 2' },
    { id: 48, name: 'CAR TARG 3' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'CAR TARG 4' },
    { id: 54, name: 'CAR TARG 5 RGHT' },
    { id: 56, name: 'L L 3 BANK BOT' },
    { id: 57, name: 'L L 3 BANK MID' },
    { id: 58, name: 'L L 3 BANK TOP' },

    { id: 61, name: 'U R 3 BANK BOT' },
    { id: 62, name: 'U R 3 BANK MID' },
    { id: 63, name: 'U R 3 BANK TOP' },
    { id: 64, name: 'U L 3 BANK BOT' },
    { id: 65, name: 'U L 3 BANK MID' },
    { id: 66, name: 'U L 3 BANK TOP' },
    { id: 67, name: 'BOWL ENTRY' },
    { id: 68, name: 'BOWL EXIT' },

    { id: 71, name: 'RAMP ENTRY' },
    { id: 72, name: 'SCOOP DOWN' },
    { id: 73, name: 'SCOOP MADE' },
    { id: 74, name: 'DOG ENTRY' },
    { id: 76, name: 'R 3 BANK BOTTOM' },
    { id: 77, name: 'R 3 BANK MIDDLE' },
    { id: 78, name: 'R 3 BANK TOP' },
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
    image: 'playfield-jy.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44
      31, 36, 37, 41, 42, 43, 44,
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
