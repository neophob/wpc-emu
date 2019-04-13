'use strict';

module.exports = {
  name: 'WPC-DMD: Strike Master Shuffle Alley (Redemption game)',
  version: 'L-4',
  rom: {
    u06: 'STRIK_L4.ROM',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'GAME SELECT' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKET OPTO' },
    { id: 27, name: 'LOW TICKET SENSE' },
    { id: 28, name: 'MAN TICKET DISP' },

    { id: 31, name: 'HIGH SCORE RESET' },
    { id: 33, name: 'PIN SWITCH H' },
    { id: 34, name: 'PIN SWITCH AA' },
    { id: 35, name: 'PIN SWITCH G' },
    { id: 36, name: 'PIN SWITCH S' },
    { id: 37, name: 'PIN SWITCH R' },
    { id: 38, name: 'PIN SWITCH Q' },

    { id: 41, name: 'PIN SWITCH P' },
    { id: 42, name: 'PIN SWITCH O' },
    { id: 43, name: 'PIN SWITCH N' },
    { id: 44, name: 'PIN SWITCH M' },
    { id: 45, name: 'PIN SWITCH W' },
    { id: 46, name: 'PIN SWITCH V' },
    { id: 47, name: 'PIN SWITCH U' },
    { id: 48, name: 'PIN SWITCH T' },

    { id: 51, name: 'PIN SWITCH Z' },
    { id: 52, name: 'PIN SWITCH Y' },
    { id: 53, name: 'PIN SWITCH X' },
    { id: 54, name: 'BACK ROW' },
    { id: 55, name: 'PIN SWITCH K' },
    { id: 56, name: 'PIN SWITCH L' },

    { id: 61, name: 'PIN SWITCH F' },
    { id: 62, name: 'PIN SWITCH E' },
    { id: 63, name: 'PIN SWITCH B' },
    { id: 64, name: 'PIN SWITCH A' },
    { id: 65, name: 'PIN SWITCH D' },
    { id: 66, name: 'PIN SWITCH C' },
    { id: 67, name: 'PIN SWITCH J' },
    { id: 68, name: 'PIN SWITCH I' },
  ],
  skipWpcRomCheck: true,
  features: [
    'wpcDmd',
  ],
  initialise: {
    closedSwitches: [
      22,
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
