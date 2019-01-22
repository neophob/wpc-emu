'use strict';

module.exports = {
  name: 'WPC-DMD: Hot Shot Basketball (Redemption game)',
  version: 'P-8',
  rom: {
    u06: 'hshot_p8.u6',
    u14: 'hshot_l1.u14',
    u18: 'hshot_l1.u18',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 15, name: 'SERVE BALL LEFT' },
    { id: 16, name: 'SERVE BALL RIGHT' },
    { id: 17, name: 'SELECT GAME' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 26, name: 'BALL IN SHOOTER' },
    { id: 27, name: 'DISPENSER LOW' },
    { id: 28, name: 'DISPENSER UNJAM' },

    { id: 31, name: 'BASKET' },
    { id: 32, name: 'BASKET MTR TOP' },
    { id: 33, name: 'BASKET MTR BOT' },
  ],
  skipWmcRomCheck: true,
  initialise: {
    closedSwitches: [
      22
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
