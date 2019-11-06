'use strict';

module.exports = {
  name: 'WPC-95: Attack from Mars (FreeWPC, Broken)',
  version: '0.32',
  pinmame: {
    knownNames: [ 'afm_f10', 'afm_f20', 'afm_f32' ],
    gameName: 'Attack from Mars (FreeWPC)',
    id: 'afmF',
  },
  rom: {
    u06: 'afm_1_13.bin',
  },
  switchMapping: [
    { id: 11, name: 'LAUNCH BUTTON' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT RETURN' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LEFT POPPER' },
    { id: 37, name: 'RIGHT POPPER' },
    { id: 38, name: 'LEFT TOP LANE' },

    { id: 41, name: 'MARTI"A"N TARGET' },
    { id: 42, name: 'MARTIA"N" TARGET' },
    { id: 43, name: 'MAR"T"IAN TARGET' },
    { id: 44, name: 'MART"I"AN TARGET' },
    { id: 45, name: 'L MOTOR BANK' },
    { id: 46, name: 'C MOTOR BANK' },
    { id: 47, name: 'R MOTOR BANK' },
    { id: 48, name: 'RIGHT TOP LANE' },

    { id: 51, name: 'LEFT SLINGSHOT' },
    { id: 52, name: 'RIGHT SLINGSHOT' },
    { id: 53, name: 'LEFT JET' },
    { id: 54, name: 'BOTTOM JET' },
    { id: 55, name: 'RIGHT JET' },
    { id: 56, name: '"M"ARTIAN TARGET' },
    { id: 57, name: 'M"A"RTIAN TARGET' },
    { id: 58, name: 'MA"R"TIAN TARGET' },

    { id: 61, name: 'L RAMP ENTER' },
    { id: 62, name: 'C RAMP ENTER' },
    { id: 63, name: 'R RAMP ENTER' },
    { id: 64, name: 'L RAMP EXIT' },
    { id: 65, name: 'R RAMP EXIT' },
    { id: 66, name: 'MOTOR BANK DOWN' },
    { id: 67, name: 'MOTOR BANK UP' },

    { id: 71, name: 'RIGHT LOOP HI' },
    { id: 72, name: 'RIGHT LOOP LO' },
    { id: 73, name: 'LEFT LOOP HI' },
    { id: 74, name: 'LEFT LOOP LO' },
    { id: 75, name: 'L SAUCER TGT' },
    { id: 76, name: 'R SAUCER TGT' },
    { id: 77, name: 'DROP TARGET' },
    { id: 78, name: 'CENTER TROUGH' },
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
    image: 'playfield-afm.jpg',
    lamps: [
      [{ x: 71, y: 318, color: 'GREEN' }],
      [{ x: 61, y: 326, color: 'GREEN' }],
      [{ x: 81, y: 309, color: 'GREEN' }],
      [{ x: 99, y: 309, color: 'GREEN' }],
      [{ x: 91, y: 330, color: 'RED' }],
      [{ x: 110, y: 318, color: 'GREEN' }],
      [{ x: 120, y: 326, color: 'GREEN' }],
      [{ x: 102, y: 92, color: 'RED' }],

      [{ x: 61, y: 241, color: 'RED' }], // 21
      [{ x: 58, y: 224, color: 'RED' }],
      [{ x: 53, y: 207, color: 'RED' }],
      [{ x: 49, y: 191, color: 'RED' }],
      [{ x: 44, y: 172, color: 'RED' }],
      [{ x: 71, y: 188, color: 'GREEN' }],
      [{ x: 68, y: 175, color: 'GREEN' }],
      [{ x: 65, y: 159, color: 'RED' }],

      [{ x: 126, y: 248, color: 'RED' }], // 31
      [{ x: 131, y: 232, color: 'RED' }],
      [{ x: 135, y: 215, color: 'RED' }],
      [{ x: 142, y: 199, color: 'RED' }],
      [{ x: 145, y: 182, color: 'RED' }],
      [{ x: 125, y: 181, color: 'YELLOW' }],
      [{ x: 122, y: 193, color: 'GREEN' }],
      [{ x: 128, y: 169, color: 'ORANGE' }],

      [{ x: 175, y: 159, color: 'RED' }], // 41
      [{ x: 61, y: 143, color: 'RED' }],
      [{ x: 125, y: 23, color: 'RED' }],
      [{ x: 145, y: 22, color: 'RED' }],
      [{ x: 89, y: 136, color: 'RED' }],
      [{ x: 99, y: 136, color: 'RED' }],
      [{ x: 109, y: 136, color: 'RED' }],
      [{ x: 78, y: 147, color: 'GREEN' }],

      [{ x: 99, y: 260, color: 'RED' }], // 51
      [{ x: 99, y: 244, color: 'RED' }],
      [{ x: 99, y: 227, color: 'RED' }],
      [{ x: 76, y: 215, color: 'YELLOW' }],
      [{ x: 74, y: 203, color: 'GREEN' }],
      [{ x: 99, y: 212, color: 'RED' }],
      [{ x: 99, y: 196, color: 'RED' }],
      [{ x: 99, y: 179, color: 'RED' }],

      [{ x: 151, y: 252, color: 'YELLOW' }], // 61
      [{ x: 150, y: 240, color: 'YELLOW' }],
      [{ x: 155, y: 219, color: 'ORANGE' }],
      [{ x: 159, y: 206, color: 'ORANGE' }],
      [{ x: 163, y: 192, color: 'RED' }],
      [{ x: 168, y: 176, color: 'RED' }],
      [{ x: 131, y: 156, color: 'RED' }],
      [{ x: 122, y: 147, color: 'GREEN' }],

      [{ x: 32, y: 208, color: 'YELLOW' }], // 71
      [{ x: 28, y: 194, color: 'YELLOW' }],
      [{ x: 24, y: 180, color: 'YELLOW' }],
      [{ x: 21, y: 164, color: 'RED' }],
      [{ x: 16, y: 148, color: 'RED' }],
      [{ x: 32, y: 264, color: 'GREEN' }],
      [{ x: 34, y: 253, color: 'GREEN' }],
      [{ x: 37, y: 242, color: 'GREEN' }],

      [{ x: 91, y: 380, color: 'RED' }], // 81
      [{ x: 8, y: 304, color: 'YELLOW' }],
      [{ x: 24, y: 296, color: 'YELLOW' }],
      [{ x: 159, y: 296, color: 'YELLOW' }],
      [{ x: 173, y: 304, color: 'YELLOW' }],
      [{ x: 180, y: 390, color: 'RED' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 10, y: 390, color: 'RED' }],
    ],
    flashlamps: [
      { id: 17, x: 184, y: 40 },
      { id: 18, x: 157, y: 79 },
      { id: 19, x: 188, y: 188 },
      { id: 20, x: 174, y: 251 },
      { id: 21, x: 99, y: 160 },
      { id: 22, x: 150, y: 63 },
      { id: 23, x: 102, y: 93 },
      { id: 25, x: 14, y: 28 },
      { id: 26, x: 74, y: 21 },
      { id: 27, x: 20, y: 120 },
      { id: 28, x: 237, y: 153 },
    ],
  },
  skipWpcRomCheck: false,
  features: [
    'securityPic',
    'wpc95',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37
      31, 36, 37, 67,
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
