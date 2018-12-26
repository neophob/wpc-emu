'use strict';

module.exports = {
  name: 'Scared Stiff',
  version: '1.5',
  rom: {
    u06: 'SS_G11.1_5',
  },
  switchMapping: [
    { id: 12, name: 'WHEEL INDEX' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RT FLIPPER LANE' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 25, name: 'EXTRA BALL LANE' },
    { id: 26, name: 'LFT FLIPPER LANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'SINGLE STANDUP' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'RIGHT POPPER' },
    { id: 37, name: 'LEFT KICKOUT' },
    { id: 38, name: 'CRATE ENTERANCE' },

    { id: 41, name: 'COFFIN LEFT' },
    { id: 42, name: 'COFFIN CENTER' },
    { id: 43, name: 'COFFIN RIGHT' },
    { id: 44, name: 'LEFT RAMP ENTER' },
    { id: 45, name: 'RIGHT RAMP ENTER' },
    { id: 46, name: 'LEFT RAMP MADE' },
    { id: 47, name: 'RIGHT RAMP MADE' },
    { id: 48, name: 'COFFIN ENTERANCE' },

    { id: 51, name: 'LEFT SLINGSHOT' },
    { id: 52, name: 'RIGHT SLINGSHOT' },
    { id: 53, name: 'UPPER JET' },
    { id: 54, name: 'CENTER JET' },
    { id: 55, name: 'LOWER JET' },
    { id: 56, name: 'UPPER SLINGSHOT' },
    { id: 57, name: 'CRATE SENSOR' },
    { id: 58, name: 'LEFT LOOP' },

    { id: 61, name: 'THREE BANK UPPER' },
    { id: 62, name: 'THREE BANK MID' },
    { id: 63, name: 'THREE BANK LOWER' },
    { id: 64, name: 'LEFT LEAPER' },
    { id: 65, name: 'CENTER LEAPER' },
    { id: 66, name: 'RIGHT LEAPER' },
    { id: 67, name: 'RT RAMP 10 POINT' },
    { id: 68, name: 'RIGHT ROOP' },

    { id: 71, name: 'LEFT SKULL LANE' },
    { id: 72, name: 'CNTR SKULL LANE' },
    { id: 73, name: 'RIGHT SKULL LANE' },
    { id: 74, name: 'SECRET PASSAGE' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  skipWmcRomCheck: true,
  features: [
    'securityPic',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
      31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
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
