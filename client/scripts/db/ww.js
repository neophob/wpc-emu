'use strict';

module.exports = {
  name: 'White Water',
  version: 'L-5',
  rom: {
    u06: 'wwatr_l5.rom',
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
  skipWmcRomCheck: true,
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
