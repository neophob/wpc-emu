'use strict';

module.exports = {
  name: 'WPC-DMD: SlugFest (Redemption game)',
  version: 'L-1',
  rom: {
    u06: 'sf_u6.l1',
  },
  switchMapping: [
    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'DISPENSER PRICE' },
    { id: 25, name: 'STEAL BASE/RUN' },
    { id: 26, name: 'BAT SWITCH' },
    { id: 27, name: 'DISPENSER LOW' },
    { id: 28, name: 'DISPENSER UNJAM' },

    { id: 31, name: 'PINCH HIT' },
    { id: 32, name: 'FAST BALL PITCH' },
    { id: 33, name: 'CHANGEUP PITCH' },
    { id: 34, name: 'CURVE PITCH' },
    { id: 35, name: 'SCREW BALL PITCH' },
    { id: 36, name: 'THROW OUT RUNNER' },
    { id: 37, name: 'START PLAYER 1' },
    { id: 38, name: 'START PLAYER 2' },

    { id: 41, name: 'TARGET PANEL-L' },
    { id: 42, name: 'TARGET PANEL-2L' },
    { id: 43, name: 'TARGET PANEL-3L' },
    { id: 44, name: 'TARGET PANEL-M' },
    { id: 45, name: 'TARGET PANEL-3R' },
    { id: 46, name: 'TARGET PANEL-2R' },
    { id: 47, name: 'TARGET PANEL-R' },

    { id: 51, name: 'BLACK-ROW TROUGH' },
    { id: 52, name: 'STRIKE TROUGH' },
    { id: 54, name: 'PITCH OPTO' },
    { id: 55, name: 'RAMP OPTO' },
    { id: 56, name: 'PLAYFIELD TILT1' },
    { id: 57, name: 'PLAYFIELD TILT2' },

    { id: 61, name: 'L BLEACHER' },
    { id: 62, name: 'M BLEACHER' },
    { id: 63, name: 'R BLEACHER' },
  ],
  skipWmcRomCheck: true,
  features: [
    'wpcDmd',
  ],
  initialise: {
    closedSwitches: [
      22,
      // OPTO SWITCHES: 54, 55,
      54, 55,
      61, 62, 63,
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
