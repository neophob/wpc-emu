'use strict';

module.exports = {
  name: 'WPC-95: Attack from Mars (FreeWPC, Broken)',
  version: '0.32',
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
  skipWmcRomCheck: false,
  features: [
    'securityPic',
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
