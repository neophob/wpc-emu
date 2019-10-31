'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Creature from the Black Lagoon',
  version: 'L-4',
  pinmame: {
    knownNames: [ 'cftbl_p3', 'cftbl_l2', 'cftbl_d2', 'cftbl_l3', 'cftbl_d3', 'cftbl_l4', 'cftbl_d4', 'cftbl_l5c' ],
    gameName: 'Creature from the Black Lagoon',
    id: 'cftbl',
  },
  rom: {
    u06: 'creat_l4.rom',
  },
  switchMapping: [
    { id: 13, name: 'CREDIT BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'TOP LEFT RO' },
    { id: 16, name: 'LEFT SUBWAY' },
    { id: 17, name: 'CENTER SUBWAY' },
    { id: 18, name: 'CNTR SHOT RU' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: '<P>AID' },
    { id: 26, name: 'P<A>ID' },
    { id: 27, name: 'PA<I>D' },
    { id: 28, name: 'PAI<D>' },

    { id: 33, name: 'BOTTOM JET' },
    { id: 34, name: 'RIGHT POPPER' },
    { id: 35, name: 'R RAMP ENTER' },
    { id: 36, name: 'L RAMP ENTER' },
    { id: 37, name: 'LOW R POPPER' },
    { id: 38, name: 'RAMP UP DWN' },

    { id: 41, name: 'COLA' },
    { id: 42, name: 'HOTDOG' },
    { id: 43, name: 'POPCORN' },
    { id: 44, name: 'ICE CREAM' },
    { id: 45, name: 'LEFT JET' },
    { id: 46, name: 'RIGHT JET' },
    { id: 47, name: 'LEFT SLING' },
    { id: 48, name: 'RIGHT SLING' },

    { id: 51, name: 'LEFT OUTLANE' },
    { id: 52, name: 'LEFT RET LANE' },
    { id: 53, name: 'RIGHT RET LANE' },
    { id: 54, name: 'RIGHT OUTLANE' },
    { id: 55, name: 'OUTHOLE' },
    { id: 56, name: 'RGHT TROUGH' },
    { id: 57, name: 'CNTR TROUGH' },
    { id: 58, name: 'LFT TROUGH' },

    { id: 61, name: 'R RAMP EXIT' },
    { id: 62, name: 'LOW L RAMP EXIT' },
    { id: 63, name: 'CNTR LANE EXIT' },
    { id: 64, name: 'UPPER RAMP EXIT' },
    { id: 65, name: 'BOWL' },
    { id: 66, name: 'SHOOTER' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-cftbl.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  initialise: {
    closedSwitches: [
      56, 57, 58,
      22,
      'F2', 'F4',
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
