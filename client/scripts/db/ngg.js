'use strict';

module.exports = {
  name: 'WPC-95: No Good Gofers',
  version: '1.3',
  rom: {
    u06: 'go_g11.1_3',
  },
  switchMapping: [
    { id: 12, name: 'LEFT RAMP MAKE' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'CENTER RAMP MAKE' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'SHOOTER GROOVE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'JET ADV STANDUP' },
    { id: 25, name: 'UNDERGROUND PASS' },
    { id: 26, name: 'LEFT INLANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'KICKBACK' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'TROUGH BALL 5' },
    { id: 37, name: 'TROUGH BALL 6' },
    { id: 38, name: 'JET POPPER' },

    { id: 41, name: 'L GOFER DOWN' },
    { id: 42, name: 'R GOFER DOWN' },
    { id: 44, name: 'PUTT OUT POPPER' },
    { id: 45, name: 'RGT POPPER JAM' },
    { id: 46, name: 'RIGHT POPPER' },
    { id: 47, name: 'LEFT RAMP DOWN' },
    { id: 48, name: 'RIGHT RAMP DOWN' },

    { id: 51, name: 'LEFT SLINGSHOT' },
    { id: 52, name: 'RIGHT SLINGSHOT' },
    { id: 53, name: 'TOP JET' },
    { id: 54, name: 'MIDDLE JET' },
    { id: 55, name: 'BOTTOM JET' },
    { id: 56, name: 'TOP SKILL SHOT' },
    { id: 57, name: 'MID SKILL SHOT' },
    { id: 58, name: 'LOWER SKILL SHOT' },

    { id: 61, name: 'LEFT SPINNER' },
    { id: 62, name: 'RIGHT SPINNER' },
    { id: 63, name: 'INNER WHEEL OPTO' },
    { id: 64, name: 'OUTER WHEEL OPTO' },
    { id: 65, name: 'LEFT GOFER 1' },
    { id: 66, name: 'LEFT GOFER 2' },
    { id: 67, name: 'BEHIND L GOFER' },
    { id: 68, name: 'HOLE IN 1 MADE' },

    { id: 71, name: 'LEFT CART PATH' },
    { id: 72, name: 'RIGHT CART PATH' },
    { id: 73, name: 'RIGHT RAMP MAKE' },
    { id: 74, name: 'GOLF CART' },
    { id: 75, name: 'RIGHT GOFER 1' },
    { id: 76, name: 'RIGHT GOFER 2' },
    { id: 77, name: 'ADV TRAP VALUE' },
    { id: 78, name: 'SAND TRAP EJECT' },

    { id: 81, name: 'K-I-C-K ADVANCE' },
    { id: 82, name: '(K)ICK' },
    { id: 83, name: 'K(I)CK' },
    { id: 84, name: 'KI(C)K' },
    { id: 85, name: 'KIC(K)' },
    { id: 86, name: 'CAPTIVE BALL' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-ngg.jpg',
  },
  skipWmcRomCheck: true,
  features: [
    'securityPic',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 44, 45, 46, 63, 64
      31, 38, 41, 42, 44, 45, 46, 63, 64,
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
