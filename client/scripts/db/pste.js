'use strict';

module.exports = {
  name: 'WPC-DCS: Popeye Saves the Earth',
  version: 'LX-5',
  rom: {
    u06: 'peye_lx5.rom',
  },
  switchMapping: [
    { id: 11, name: 'LEFT LANE' },
    { id: 12, name: 'BUY IN' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RIGHT LANE' },
    { id: 16, name: 'LEFT JET' },
    { id: 17, name: 'RIGHT JET' },
    { id: 18, name: 'CENTER JET' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BALL LAUNCH' },
    { id: 25, name: 'LEFT LOOP' },
    { id: 26, name: 'POPEYE "E1"' },
    { id: 27, name: 'POPEYE "Y"' },
    { id: 28, name: 'POPEYE "E2"' },

    { id: 31, name: 'LEFT POPPER' },
    { id: 32, name: 'RIGHT POPPER' },
    { id: 33, name: 'RIGHT LOOP OPTO' },
    { id: 34, name: 'RAMP ENTRANCE' },
    { id: 35, name: 'RAMP COMPLETION' },
    { id: 36, name: 'ESCALATOR POPPER' },
    { id: 37, name: 'WHEEL EXIT' },
    { id: 38, name: 'HAG STANDUP' },

    { id: 41, name: 'TWO BANK' },
    { id: 42, name: 'CENTER LANE' },
    { id: 43, name: 'LOCKUP UPPER' },
    { id: 44, name: 'LOCKUP CENTER' },
    { id: 45, name: 'LOCKUP LOWER' },
    { id: 46, name: 'WHEEL OPTO 1' },
    { id: 47, name: 'WHEEL OPTO 2' },
    { id: 48, name: 'WHEEL OPTO 3' },

    { id: 51, name: 'RIGHT TROUGH' },
    { id: 52, name: 'TROUGH 2ND' },
    { id: 53, name: 'TROUGH 3RD' },
    { id: 54, name: 'TROUGH 4TH' },
    { id: 55, name: 'TROUGH 5TH' },
    { id: 56, name: 'LEFT TROUGH' },
    { id: 57, name: 'TROUGH JAM' },
    { id: 58, name: '"SEA" STANDUP' },

    { id: 61, name: 'LEFT CHEEK' },
    { id: 62, name: 'RIGHT CHEEK' },
    { id: 63, name: 'ESCALATOR EXIT' },
    { id: 64, name: 'ANIMAL DOLPHIN' },
    { id: 65, name: 'ANIMAL EAGLE' },
    { id: 66, name: 'ANIMAL LEOPARD' },
    { id: 67, name: 'ANIMAL PANDA' },
    { id: 68, name: 'ANIMAL RHINO' },

    { id: 71, name: 'POPEYE "P1"' },
    { id: 72, name: 'POPEYE "O"' },
    { id: 73, name: 'POPEYE "P2"' },
    { id: 74, name: 'LEFT OUTLANE' },
    { id: 75, name: 'LEFT FLIP LANE' },
    { id: 76, name: 'LEFT SLINGSHOT' },
    { id: 77, name: 'RIGHT SLINGSHOT' },
    { id: 78, name: 'RIGHT FLIP LANE' },

    { id: 81, name: 'UP EXIT TO WHEEL' },
    { id: 82, name: 'UPPER RAMP LEFT' },
    { id: 83, name: 'UPPER RAMP RIGHT' },
    { id: 84, name: 'ANIMAL JACKPOT' },
    { id: 85, name: 'RIGHT OUTLANE' },
    { id: 86, name: 'SHOOTER LANE' },
    { id: 87, name: 'LOCKUP KICKER' },
    { id: 88, name: 'UPPER SHOT EXIT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-pste.jpg',
  },
  skipWmcRomCheck: true,
  initialise: {
    closedSwitches: [
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 46, 47, 48, 51, 52, 53, 54, 55, 56, 57, 81, 82, 83
      22,
      31, 32, 33, 34, 35, 36, 37, 46, 47, 48, 57, 81, 82, 83,
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
