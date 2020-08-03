'use strict';

module.exports = {
  name: 'WPC-ALPHA: Dr. Dude',
  version: 'P-7',
  pinmame: {
    knownNames: [ 'dd_p7' ],
    gameName: 'Dr. Dude',
    id: 'dd',
  },
  rom: {
    u06: 'dude_u6.p7',
  },
  switchMapping: [
    { id: 11, name: 'PLUMB TILT' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'RIGHT COIN SWITCH' },
    { id: 15, name: 'CENTER COIN SWITCH' },
    { id: 16, name: 'LEFT COIN SWITCH' },
    { id: 17, name: 'SLAM TILT' },
    { id: 18, name: 'HIGH SCORE RESET' },

    { id: 21, name: 'SHOOTER LANE' },
    { id: 22, name: 'OUTHOLE' },
    { id: 23, name: 'TROUGH 1 BALL' },
    { id: 24, name: 'TROUGH 2 BALLS' },
    { id: 25, name: 'TROUGH 3 BALLS' },
    { id: 26, name: 'HEART TARGET' },
    { id: 27, name: 'ENTER LEFT RAMP' },
    { id: 28, name: 'SCORE LEFT RAMP' },

    { id: 31, name: 'LEFT OUTLANE' },
    { id: 32, name: 'RIGHT OUTLANE' },
    { id: 33, name: 'RIGHT RETURN' },
    { id: 34, name: 'LEFT RETURN' },
    { id: 35, name: 'RIGHT DROP 1 (TOP)' },
    { id: 36, name: 'RIGHT DROP 2' },
    { id: 37, name: 'RIGHT DROP 3' },
    { id: 38, name: 'RIGHT DROP 4 (BOTTOM)' },

    { id: 41, name: 'REFLE(X)' },
    { id: 42, name: 'REFL(E)X' },
    { id: 43, name: 'REF(L)EX' },
    { id: 44, name: 'RE(F)LEX' },
    { id: 45, name: 'R(E)FLEX' },
    { id: 46, name: '(R)EFLEX' },
    { id: 47, name: 'BIG SHOT' },
    { id: 48, name: 'MIDDLE RIGHT POPPER' },

    { id: 51, name: 'MIXER GAB TOP' },
    { id: 52, name: 'MIXER GAB MIDDLE' },
    { id: 53, name: 'MIXER GAB BOTTOM' },
    { id: 54, name: 'MIXER HEART LEFT' },
    { id: 55, name: 'MIXER HEART MIDDLE' },
    { id: 56, name: 'MIXER HEART RIGHT' },
    { id: 57, name: 'TOP LEFT 10 PTS' },

    { id: 61, name: 'MIXER MAG TOP' },
    { id: 62, name: 'MIXER MAG MIDDLE' },
    { id: 63, name: 'MIXER MAG BOTTOM' },
    { id: 66, name: 'MIDDLE MIDDLE 10 PTS' },
    { id: 67, name: 'MIDDLE BOTTOM 10 PTS' },
    { id: 68, name: 'MIDDLE TOP 10 PTS' },

    { id: 71, name: '1 TEST TARGET' },
    { id: 72, name: 'MAGNET TARGET' },
    { id: 73, name: 'TOP LEFT POPPER' },
    { id: 74, name: 'LEFT JUMPER BUMPER' },
    { id: 75, name: 'RIGHT JUMPER BUMPER' },
    { id: 76, name: 'BOTTOM JUMPER BUMPER' },
    { id: 77, name: 'LEFT SLINGSHOT' },
    { id: 78, name: 'RIGHT SLINGSHOT' },

    { id: 81, name: 'RIGHT FLIPPER' },
    { id: 82, name: 'LEFT FLIPPER' },
    { id: 83, name: 'RIGHT LOOP' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-dd.jpg',
  },
  skipWpcRomCheck: false,
  features: [
    'wpcAlphanumeric',
  ],
  cabinetColors: [
    '#F5F455',
    '#DE7638',
    '#B3ACD7',
  ],
  initialise: {
    closedSwitches: [
      23, 24, 25
    ],
    initialAction: [
      {
        delayMs: 1500,
        source: 'cabinetInput',
        value: 16
      },
    ],
  },
};
