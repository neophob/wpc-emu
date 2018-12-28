'use strict';

module.exports = {
  name: 'WPC-DCS: Addams Family Values',
  version: 'L-4',
  rom: {
    u06: 'afv_u6.l4',
  },
  switchMapping: [
    { id: 13, name: 'COIN DROP' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 16, name: 'TICKET NOTCH' },
    { id: 17, name: 'TICKET LOW' },
    { id: 18, name: 'TICKET TEST' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 28, name: 'WHEEL INDEX' },

    { id: 31, name: 'BOTTOM SLOT 16' },
    { id: 32, name: 'BOTTOM SLOT 15' },
    { id: 33, name: 'BOTTOM SLOT 14' },
    { id: 34, name: 'BOTTOM SLOT 13' },
    { id: 35, name: 'BOTTOM SLOT 12' },
    { id: 36, name: 'BOTTOM SLOT 11' },
    { id: 37, name: 'BOTTOM SLOT 10' },
    { id: 38, name: 'BOTTOM SLOT 9' },

    { id: 41, name: 'BOTTOM SLOT 8' },
    { id: 42, name: 'BOTTOM SLOT 7' },
    { id: 43, name: 'BOTTOM SLOT 6' },
    { id: 44, name: 'BOTTOM SLOT 5' },
    { id: 45, name: 'BOTTOM SLOT 4' },
    { id: 46, name: 'BOTTOM SLOT 3' },
    { id: 47, name: 'BOTTOM SLOT 2' },
    { id: 48, name: 'BOTTOM SLOT 1' },

    { id: 51, name: 'GOBBLE RIGHT' },
    { id: 52, name: 'GOBBLE CENTER' },
    { id: 53, name: 'GOBBLE LEFT' },
  ],
  skipWmcRomCheck: true,
  initialise: {
    closedSwitches: [
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48
      22,
      31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
    ],
  }
};
