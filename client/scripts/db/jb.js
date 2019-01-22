'use strict';

module.exports = {
  name: 'WPC-S: Jack·Bot',
  version: '1.0R',
  rom: {
    u06: 'jack1_0r.rom',
  },
  switchMapping: [
    { id: 11, name: 'L LEFT 10 POINT' },
    { id: 12, name: 'U LEFT 10 POINT' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RAMP IS DOWN' },
    { id: 16, name: 'HIGH DROP TARGET' },
    { id: 17, name: 'CENT DROP TARGET' },
    { id: 18, name: 'LOW DROP TARGET' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY EXTRA BALL' },
    { id: 25, name: 'LEFT OUTLANE' },
    { id: 26, name: 'L FLIPPER LANE' },
    { id: 27, name: 'R FLIPPER LANE' },
    { id: 28, name: 'RIGHT OUTLANE' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1 (RIGHT)' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4 (LEFT)' },
    { id: 36, name: 'RAMP EXIT' },
    { id: 37, name: 'RAMP ENTRANCE' },
    { id: 38, name: 'TARG UNDER RAMP' },

    { id: 41, name: 'VISOR 1 (LEFT)' },
    { id: 42, name: 'VISOR 2' },
    { id: 43, name: 'VISOR 3' },
    { id: 44, name: 'VISOR 4' },
    { id: 45, name: 'VISOR 5 (RIGHT)' },
    { id: 46, name: 'GAME SAUCER' },
    { id: 47, name: 'LEFT EJECT HOLE' },
    { id: 48, name: 'RIGHT EJECT HOLE' },

    { id: 51, name: '5-BANK 1 (UPPER)' },
    { id: 52, name: '5-BANK TARGET 2' },
    { id: 53, name: '5-BANK TARGET 3' },
    { id: 54, name: '5-BANK TARGET 4' },
    { id: 55, name: '5-BANK 5 (LOWER)' },
    { id: 56, name: 'VORTEX UPPER' },
    { id: 57, name: 'VORTEX CENTER' },
    { id: 58, name: 'VORTEX LOWER' },

    { id: 61, name: 'UPPER JET BUMPER' },
    { id: 62, name: 'LEFT JET BUMPER' },
    { id: 63, name: 'LOWER JET BUMPER' },
    { id: 64, name: 'RIGHT SLINGSHOT' },
    { id: 65, name: 'LEFT SLINGSHOT' },
    { id: 66, name: 'RIGHT 10 POINT' },
    { id: 67, name: 'HIT ME TARGET' },
    { id: 68, name: 'BALL SHOOTER' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'VISOR IS CLOSED' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'VISOR IS OPEN' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  skipWmcRomCheck: true,
  features: [
    'securityPic',
  ],
  initialise: {
    closedSwitches: [
      22, 31,
      //OPTO SWITCHES: 16, 17, 18, 41, 42, 43, 44, 45
      16, 17, 18,
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
