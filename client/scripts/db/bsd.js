'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Bram Stoker\'s Dracula',
  version: 'L-1',
  rom: {
    u06: 'dracu_l1.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'L DROP TARGET' },
    { id: 16, name: 'L DROP SCORE' },
    { id: 17, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'TOP 3LANE L' },
    { id: 26, name: 'TOP 3LANE M' },
    { id: 27, name: 'TOP 3LANE R' },
    { id: 28, name: 'R RAMP SCORE' },

    { id: 31, name: 'UNDER SHOOT RAMP' },
    { id: 34, name: 'LAUNCH BALL' },
    { id: 35, name: 'LEFT DRAIN' },
    { id: 36, name: 'LEFT RETURN' },
    { id: 37, name: 'RIGHT RETURN' },
    { id: 38, name: 'RIGHT DRAIN' },

    { id: 41, name: 'TROUGH 1 BALL' },
    { id: 42, name: 'TROUGH 2 BALLS' },
    { id: 43, name: 'TROUGH 3 BALLS' },
    { id: 44, name: 'TROUGH 4 BALLS' },
    { id: 48, name: 'OUTHOLE' },

    { id: 51, name: 'OPTO TR LANE' },
    { id: 52, name: 'OPTO MAG LPOCKET' },
    { id: 53, name: 'OPTO CASTLE 1' },
    { id: 54, name: 'OPTO CASTLE 2' },
    { id: 55, name: 'OPTO BL POPPER' },
    { id: 56, name: 'OPTO TL POPPER' },
    { id: 57, name: 'OPTO CASTLE 3' },
    { id: 58, name: 'MYSTERY HOLE' },

    { id: 61, name: 'LEFT JET' },
    { id: 62, name: 'RIGHT JET' },
    { id: 63, name: 'BOTTOM JET' },
    { id: 64, name: 'LEFT SLING' },
    { id: 65, name: 'RIGHT SLING' },
    { id: 66, name: 'LEFT 3BANK T' },
    { id: 67, name: 'LEFT 3BANK M' },
    { id: 68, name: 'LEFT 3BANK B' },

    { id: 71, name: 'OPTO CASTLE POP' },
    { id: 72, name: 'OPTO COFFIN POP' },
    { id: 73, name: 'OPTO LRAMP ENTRY' },
    { id: 77, name: 'R RAMP UP' },

    { id: 81, name: 'MAGNET LEFT' },
    { id: 82, name: 'BALL ON MAGNET' },
    { id: 83, name: 'MAGNET RIGHT' },
    { id: 84, name: 'L RAMP SCORE' },
    { id: 85, name: 'L RAMP DIVERTED' },
    { id: 86, name: 'MID 3BANK L' },
    { id: 87, name: 'MID 3BANK M' },
    { id: 88, name: 'MID 3BANK R' },
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
    image: 'playfield-bsd.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  initialise: {
    closedSwitches: [
      22,
      41, 42, 43, 44,
      51, 52, 53, 54, 55, 56, 57, 71, 72, 73,
      'F2', 'F4',
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
