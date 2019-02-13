'use strict';

module.exports = {
  name: 'WPC-S: Red & Ted\'s Road Show',
  version: 'LX-5',
  rom: {
    u06: 'u6_lx5.rom',
  },
  switchMapping: [
    { id: 11, name: '"TED"S MOUTH' },
    { id: 12, name: 'DOZER DOWN' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'DOZER UP' },
    { id: 16, name: 'RIGHT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE 2' },
    { id: 18, name: 'RIGHT INLANE 1' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: '"RED"S MOUTH' },
    { id: 26, name: 'LEFT OUTLANE' },
    { id: 27, name: 'LEFT INLANE' },
    { id: 28, name: 'B ZONE 3 BANK' },

    { id: 31, name: 'SKILL SHOT LOWER' },
    { id: 32, name: 'SKILL SHOT UPPER' },
    { id: 33, name: 'RIGHT SHOOTER' },
    { id: 34, name: 'RADIO 3 BANK' },
    { id: 35, name: '"RED" STANDUP U' },
    { id: 36, name: '"RED" STAND L' },
    { id: 37, name: 'HIT "RED"' },
    { id: 38, name: 'RIGHT LOOP EXIT' },

    { id: 41, name: 'TROUGH JAM' },
    { id: 42, name: 'TROUGH 1' },
    { id: 43, name: 'TROUGH 2' },
    { id: 44, name: 'TROUGH 3' },
    { id: 45, name: 'TROUGH 4' },
    { id: 46, name: 'RIGHT LOOP ENTER' },
    { id: 47, name: 'HIT BULLDOZER' },
    { id: 48, name: 'HIT "TED"' },

    { id: 51, name: 'SPINNER' },
    { id: 52, name: 'LOCKUP 1' },
    { id: 53, name: 'LOCKUP 2' },
    { id: 54, name: 'LOCK KICKOUT' },
    { id: 55, name: 'R RAMP EXIT LEFT' },
    { id: 56, name: 'LEFT RAMP EXIT' },
    { id: 57, name: 'LEFT RAMP ENTER' },
    { id: 58, name: 'LEFT SHOOTER' },

    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGHT SLING' },
    { id: 63, name: 'LEFT JET' },
    { id: 64, name: 'TOP JET' },
    { id: 65, name: 'RIGHT JET' },

    { id: 71, name: 'RIGHT RAMP ENTER' },
    { id: 72, name: 'R RAMP EXIT CEN' },
    { id: 73, name: 'F ROCKS 5X BLAST' },
    { id: 74, name: 'F ROCKS RAD RIOT' },
    { id: 75, name: 'F ROCKS EX BALL' },
    { id: 76, name: 'F ROCKS TOP' },
    { id: 77, name: 'UNDER BLAST ZONE' },
    { id: 78, name: 'START CITY' },

    { id: 81, name: 'WHITE STANDUP' },
    { id: 82, name: 'RED STANDUP' },
    { id: 83, name: 'YELLOW STANDUP' },
    { id: 84, name: 'ORANGE STANDUP' },
    { id: 85, name: 'MID L FLIP TOP' },
    { id: 86, name: 'MID L FLIP BOT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UL FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'ML FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-rtrs.jpg',
  },
  skipWmcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 41, 42, 43, 44, 45,
      41,
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
