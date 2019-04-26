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
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-mm.jpg',
    lamps: [
      [{ x: 149, y: 245, color: 'WHITE' }],
      [{ x: 150, y: 256, color: 'WHITE' }],
      [{ x: 151, y: 268, color: 'WHITE' }],
      [{ x: 127, y: 213, color: 'RED' }],
      [{ x: 122, y: 229, color: 'YELLOW' }],
      [{ x: 116, y: 243, color: 'YELLOW' }],
      [{ x: 113, y: 255, color: 'YELLOW' }],
      [{ x: 110, y: 266, color: 'YELLOW' }],

      [{ x: 152, y: 206, color: 'RED' }], // 21
      [{ x: 146, y: 221, color: 'YELLOW' }],
      [{ x: 140, y: 235, color: 'YELLOW' }],
      [{ x: 134, y: 248, color: 'YELLOW' }],
      [{ x: 90, y: 194, color: 'LBLUE' }],
      [{ x: 88, y: 208, color: 'LBLUE' }],
      [{ x: 85, y: 222, color: 'LBLUE' }],
      [{ x: 82, y: 236, color: 'LBLUE' }],

      [{ x: 117, y: 148, color: 'YELLOW' }], // 31
      [{ x: 113, y: 160, color: 'ORANGE' }],
      [{ x: 112, y: 171, color: 'WHITE' }],
      [{ x: 105, y: 208, color: 'YELLOW' }],
      [{ x: 102, y: 220, color: 'ORANGE' }],
      [{ x: 100, y: 233, color: 'YELLOW' }],
      [{ x: 97, y: 247, color: 'YELLOW' }],
      [{ x: 95, y: 260, color: 'YELLOW' }],

      [{ x: 27, y: 178, color: 'RED' }], // 41
      [{ x: 33, y: 194, color: 'YELLOW' }],
      [{ x: 38, y: 209, color: 'YELLOW' }],
      [{ x: 44, y: 222, color: 'YELLOW' }],
      [{ x: 32, y: 236, color: 'RED' }],
      [{ x: 38, y: 249, color: 'WHITE' }],
      [{ x: 45, y: 263, color: 'WHITE' }],
      [{ x: 51, y: 277, color: 'WHITE' }],

      [{ x: 87, y: 127, color: 'RED' }], // 51
      [{ x: 91, y: 148, color: 'WHITE' }],
      [{ x: 90, y: 166, color: 'LBLUE' }],
      [{ x: 91, y: 179, color: 'LBLUE' }],
      [{ x: 143, y: 37, color: 'YELLOW' }],
      [{ x: 158, y: 37, color: 'YELLOW' }],
      [{ x: 78, y: 151, color: 'YELLOW' }],
      [{ x: 104, y: 159, color: 'YELLOW' }],

      [{ x: 111, y: 307, color: 'WHITE' }], // 61
      [{ x: 90, y: 301, color: 'WHITE' }],
      [{ x: 69, y: 307, color: 'WHITE' }],
      [{ x: 54, y: 194, color: 'RED' }],
      [{ x: 59, y: 209, color: 'YELLOW' }],
      [{ x: 63, y: 224, color: 'YELLOW' }],
      [{ x: 66, y: 236, color: 'YELLOW' }],
      [{ x: 70, y: 248, color: 'YELLOW' }],

      [{ x: 108, y: 234, color: 'WHITE' }], // 71
      [{ x: 90, y: 320, color: 'YELLOW' }],
      [{ x: 72, y: 324, color: 'WHITE' }],
      [{ x: 90, y: 341, color: 'WHITE' }],
      [{ x: 66, y: 146, color: 'GREEN' }],
      [{ x: 68, y: 158, color: 'GREEN' }],
      [{ x: 70, y: 170, color: 'YELLOW' }],
      [{ x: 180, y: 110, color: 'YELLOW' }],

      [{ x: 168, y: 302, color: 'RED' }], // 81
      [{ x: 154, y: 293, color: 'RED' }],
      [{ x: 26, y: 293, color: 'RED' }],
      [{ x: 12, y: 302, color: 'RED' }],
      [{ x: 64, y: 134, color: 'GREEN' }],
      [{ x: 90, y: 376, color: 'YELLOW' }],
      [{ x: 163, y: 394, color: 'RED' }],
      [{ x: 19, y: 394, color: 'YELLOW' }],
    ],
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
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
