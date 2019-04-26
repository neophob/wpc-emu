'use strict';

module.exports = {
  name: 'WPC-S: Indianapolis 500',
  version: '1.1R',
  rom: {
    u06: 'indy1_1r.rom',
  },
  switchMapping: [
    { id: 11, name: 'BALL LAUNCH' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT OUTLANE' },
    { id: 16, name: 'LEFT FLIP LANE' },
    { id: 17, name: 'RIGHT FLIP LANE' },
    { id: 18, name: 'RIGHT OUTLANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: 'SHOOTER LANE' },
    { id: 26, name: 'LEFT SLINGSHOT' },
    { id: 27, name: 'RIGHT SLINGSHOT' },
    { id: 28, name: 'THREE BANK UPPER' },

    { id: 31, name: 'HREE BANK CENTER' },
    { id: 32, name: 'THREE BANK LOWER' },
    { id: 34, name: 'RT FLIP WRENCH' },
    { id: 35, name: 'LEFT RAMP ENTER' },
    { id: 36, name: 'LEFT RAMP MADE' },
    { id: 37, name: 'LEFT LOOP' },
    { id: 38, name: 'RIGHT LOOP' },

    { id: 41, name: 'TOP TROUGH' },
    { id: 42, name: 'TROUGH 1 (RT)' },
    { id: 43, name: 'TROUGH 2' },
    { id: 44, name: 'TROUGH 3' },
    { id: 45, name: 'TROUGH 4 (LFT)' },
    { id: 46, name: 'LFT RAMP STANDUP' },
    { id: 47, name: 'TURBO WRENCH' },
    { id: 48, name: 'JET BUMPER WRENCH' },

    { id: 51, name: 'LEFT LANE' },
    { id: 52, name: 'CENTER LANE' },
    { id: 53, name: 'RIGHT LANE' },
    { id: 54, name: 'TEN POINT' },
    { id: 55, name: 'LEFT RAMP WRENCH' },
    { id: 56, name: 'LEFT LIGHT-UP' },
    { id: 57, name: 'CENTER LIGHT-UP' },
    { id: 58, name: 'RIGHT LIGHT-UP' },

    { id: 61, name: 'UPPER POPPER' },
    { id: 62, name: 'TURBO POPPER' },
    { id: 63, name: 'TURBO BALL SENSE' },
    { id: 64, name: 'UPPER EJECT' },
    { id: 65, name: 'LOWER KICKER' },
    { id: 66, name: 'TURBO INDEX' },

    { id: 72, name: 'LEFT JET' },
    { id: 73, name: 'RIGHT JET' },
    { id: 74, name: 'CENTER JET' },
    { id: 75, name: 'RIGHT RAMP ENTER' },
    { id: 76, name: 'RIGHT RAMP MADE' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 41, 42, 43, 44, 45, 56, 57, 58, 61, 62, 63
      41, 56, 57, 58, 61, 62, 63,
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
