'use strict';

module.exports = {
  name: 'WPC-Fliptronics: White Water "Bigfoot" (FreeWPC)',
  version: '0.1',
  rom: {
    u06: 'wwatr_l5.freewpc.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'OUTHOLE' },
    { id: 16, name: 'LEFT JET' },
    { id: 17, name: 'RIGHT JET' },
    { id: 18, name: 'CENTER JET' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKET OPTO' },
    { id: 25, name: 'LEFT OUTLANE' },
    { id: 26, name: 'LEFT FLIP LANE' },
    { id: 27, name: 'RIGHT FLIP LANE' },
    { id: 28, name: 'RIGHT OUTLANE' },

    { id: 31, name: 'RIVER "R2"' },
    { id: 32, name: 'RIVER "E"' },
    { id: 33, name: 'RIVER "V"' },
    { id: 34, name: 'RIVER "I"' },
    { id: 35, name: 'RIVER "R1"' },
    { id: 36, name: 'THREE BANK TOP' },
    { id: 37, name: 'THREE BANK CNTR' },
    { id: 38, name: 'THREE BANK LOWER' },

    { id: 41, name: 'LIGHT LOCK LEFT' },
    { id: 42, name: 'LIGHT LOCK RIGHT' },
    { id: 43, name: 'LEFT LOOP' },
    { id: 44, name: 'RIGHT LOOP' },
    { id: 45, name: 'SECRET PASSAGE' },
    { id: 46, name: 'LFT RAMP ENTER' },
    { id: 47, name: 'RAPIDS ENTER' },
    { id: 48, name: 'CANYON ENTRANCE' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'BALLSHOOTER' },
    { id: 54, name: 'LOWER JET ARENA' },
    { id: 55, name: 'RIGHT JET ARENA' },
    { id: 56, name: 'EXTRA BALL' },
    { id: 57, name: 'CANYON MAIN' },
    { id: 58, name: 'BIGFOOT CAVE' },

    { id: 61, name: 'WHIRLPOOL POPPER' },
    { id: 62, name: 'WHIRLPOOL EXIT' },
    { id: 63, name: 'LOCKUP RIGHT' },
    { id: 64, name: 'LOCKUP CENTER' },
    { id: 65, name: 'LOCKUP LEFT' },
    { id: 66, name: 'LEFT RAMP MAIN' },
    { id: 68, name: 'DISAS DROP ENTER' },

    { id: 71, name: 'RAPIDS RAMP MAIN' },
    { id: 73, name: 'HOT FOOT UPPER' },
    { id: 74, name: 'HOT FOOT LOWER' },
    { id: 75, name: 'DISAS DROP MAIN' },
    { id: 76, name: 'RIGHT TROUGH' },
    { id: 77, name: 'CENTER TROUGH' },
    { id: 78, name: 'LEFT TROUGH' },

    { id: 86, name: 'BIGFOOT OPTO 1' },
    { id: 87, name: 'BIGFOOT OPTO 2' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-ww.jpg',
    lamps: [
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 12, y: 316, color: 'YELLOW' }],
      [{ x: 12, y: 292, color: 'WHITE' }],
      [{ x: 30, y: 292, color: 'WHITE' }],
      [{ x: 154, y: 292, color: 'WHITE' }],
      [{ x: 171, y: 292, color: 'WHITE' }],
      [{ x: 63, y: 76, color: 'YELLOW' }],
      [{ x: 51, y: 274, color: 'RED' }],

      [{ x: 35, y: 202, color: 'LBLUE' }], //21
      [{ x: 35, y: 214, color: 'LBLUE' }],
      [{ x: 36, y: 224, color: 'LBLUE' }],
      [{ x: 36, y: 236, color: 'LBLUE' }],
      [{ x: 37, y: 246, color: 'LBLUE' }],
      [{ x: 73, y: 110, color: 'RED' }],
      [{ x: 75, y: 126, color: 'LBLUE' }],
      [{ x: 76, y: 133, color: 'LBLUE' }],

      [{ x: 66, y: 216, color: 'YELLOW' }], //31
      [{ x: 87, y: 192, color: 'YELLOW' }],
      [{ x: 80, y: 196, color: 'YELLOW' }],
      [{ x: 57, y: 181, color: 'YELLOW' }],
      [{ x: 52, y: 161, color: 'RED' }],
      [{ x: 63, y: 150, color: 'LBLUE' }],
      [{ x: 69, y: 322, color: 'WHITE' }],
      [{ x: 63, y: 310, color: 'LBLUE' }],

      [{ x: 109, y: 175, color: 'YELLOW' }], //41
      [{ x: 112, y: 185, color: 'YELLOW' }],
      [{ x: 77, y: 143, color: 'LBLUE' }],
      [{ x: 107, y: 165, color: 'YELLOW' }],
      [{ x: 101, y: 150, color: 'RED' }],
      [{ x: 90, y: 147, color: 'LBLUE' }],
      [{ x: 59, y: 297, color: 'YELLOW' }],
      [{ x: 55, y: 285, color: 'ORANGE' }],

      [{ x: 178, y: 172, color: 'RED' }], //51
      [{ x: 14, y: 120, color: 'RED' }],
      [{ x: 91, y: 91, color: 'RED' }],
      [{ x: 100, y: 83, color: 'RED' }],
      [{ x: 78, y: 50, color: 'YELLOW' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 127, y: 259, color: 'RED' }],
      [{ x: 130, y: 243, color: 'YELLOW' }],

      [{ x: 87, y: 310, color: 'YELLOW' }], //61
      [{ x: 118, y: 292, color: 'YELLOW' }],
      [{ x: 105, y: 270, color: 'YELLOW' }],
      [{ x: 81, y: 282, color: 'YELLOW' }],
      [{ x: 89, y: 257, color: 'YELLOW' }],
      [{ x: 94, y: 239, color: 'YELLOW' }],
      [{ x: 111, y: 231, color: 'YELLOW' }],
      [{ x: 117, y: 239, color: 'YELLOW' }],

      [{ x: 0, y: 0, color: 'BLACK' }], //71
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 123, y: 107, color: 'RED' }],
      [{ x: 133, y: 100, color: 'RED' }],

      [{ x: 144, y: 240, color: 'YELLOW' }], //81
      [{ x: 147, y: 222, color: 'YELLOW' }],
      [{ x: 163, y: 215, color: 'YELLOW' }],
      [{ x: 163, y: 195, color: 'YELLOW' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 20, y: 395, color: 'YELLOW' }],
    ],
  },
  skipWpcRomCheck: false,
  features: [
    'wpcFliptronics',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 86, 87,
      76, 77, 78,
      86, 87,
      'F2', 'F4', 'F6',
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
