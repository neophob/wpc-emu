'use strict';

module.exports = {
  name: 'WPC-DMD: Gilligan\'s Island',
  version: 'L-9',
  rom: {
    u06: 'gilli_l9.rom',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT FLIPPER' },
    { id: 12, name: 'LEFT FLIPPER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 16, name: 'TROUGH LEFT' },
    { id: 17, name: 'TROUGH RIGHT' },
    { id: 18, name: 'OUTHOLE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'LEFT OUT LANE' },
    { id: 26, name: 'LEFT RETURN LN' },
    { id: 27, name: 'RIGHT RETURN LN' },
    { id: 28, name: 'RIGHT OUT LANE' },

    { id: 31, name: 'PAYOFF MID LEFT' },
    { id: 32, name: 'RIGHT 10PT' },
    { id: 33, name: 'LEFT LOCK' },
    { id: 34, name: 'LEFT STAND UP' },
    { id: 36, name: 'LEFT BANK LEFT' },
    { id: 37, name: 'LEFT BANK MIDDLE' },
    { id: 38, name: 'LEFT BANK RIGHT' },

    { id: 41, name: 'LEFT JET' },
    { id: 42, name: 'RIGHT JET' },
    { id: 43, name: 'BOTTOM JET' },
    { id: 44, name: 'LEFT SLING' },
    { id: 45, name: 'RIGHT SLING' },
    { id: 46, name: 'RIGHT BANK LEFT' },
    { id: 47, name: 'RIGHT BANK MID' },
    { id: 48, name: 'RIGHT BANK RIGHT' },

    { id: 51, name: 'LAGOON - N' },
    { id: 52, name: 'LAGOON - O' },
    { id: 53, name: 'LAGOON - O' },
    { id: 54, name: 'LAGOON - G' },
    { id: 55, name: 'LAGOON - A' },
    { id: 56, name: 'LAGOON - L' },
    { id: 57, name: 'RAMP_SUP' },
    { id: 58, name: 'JET 10PTS' },

    { id: 61, name: 'ISLAND ENTRANCE' },
    { id: 62, name: 'RAMP STATUS' },
    { id: 63, name: 'LEFT LOOP' },
    { id: 64, name: 'RIGHT LOOP' },
    { id: 65, name: 'S_TURN' },
    { id: 66, name: 'BALL POPPER' },
    { id: 67, name: 'TOP EJECT' },
    { id: 68, name: 'TOP RIGHT' },

    { id: 71, name: 'PAYOFF TOP LEFT' },
    { id: 72, name: 'PAYOFF TOP RITE' },
    { id: 73, name: 'PAYOFF BOT RITE' },
    { id: 74, name: 'PAYOFF BOT LEFT' },
    { id: 75, name: 'LOCK LANE' },
    { id: 76, name: 'WHEEL LOCK' },
    { id: 77, name: 'WHEEL OPTO' },
    { id: 78, name: 'SHOOTER' },

    { id: 83, name: 'TOP LEFT LOOP' },
    { id: 84, name: 'TOP RIGHT LOOP' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-gilligan.jpg',
  },
  skipWmcRomCheck: true,
  features: [
    'wpcDmd',
  ],
  initialise: {
    closedSwitches: [
      16, 17, 22,
      //OPTO SWITCHES: 77
      77,
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
