module.exports = {
  name: 'WPC-ALPHA: The Machine: Bride of Pin·bot',
  version: 'L-7',
  pinmame: {
    knownNames: [ 'bop_l2', 'bop_d2', 'bop_l3', 'bop_d3', 'bop_l4', 'bop_d4', 'bop_l5', 'bop_d5', 'bop_l6', 'bop_d6', 'bop_l7', 'bop_d7', 'bop_l8', 'bop_d8' ],
    gameName: 'Machine: Bride of Pinbot, The',
    id: 'bop',
    vpdbId: 'tmbop',
  },
  rom: {
    u06: 'tmbopl_7.rom',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT FLIPPER' },
    { id: 12, name: 'LEFT FLIPPER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT OUTLANE' },
    { id: 16, name: 'LEFT FLIPPER LANE' },
    { id: 17, name: 'RIGHT FLIPPER LANE' },
    { id: 18, name: 'RIGHT OUTLANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKET OPTO' },
    { id: 25, name: 'RIGHT TROUGH' },
    { id: 26, name: 'CENTER TROUGH' },
    { id: 27, name: 'LEFT TROUGH' },
    { id: 28, name: 'LEFT STANDUP' },

    { id: 31, name: 'SKILL SHOT 50K' },
    { id: 32, name: 'SKILL SHOT 75K' },
    { id: 33, name: 'SKILL SHOT 100K' },
    { id: 34, name: 'SKILL SHOT 200K' },
    { id: 35, name: 'SKILL SHOT 25K' },
    { id: 36, name: 'RIGHT TOP STANDUP' },
    { id: 37, name: 'RIGHT BOTTOM STANDUP' },
    { id: 38, name: 'OUTHOLE' },

    { id: 41, name: 'RIGHT RAMP MADE' },
    { id: 43, name: 'LEFT LOOP' },
    { id: 44, name: 'RIGHT LOOP TOP' },
    { id: 45, name: 'RIGHT LOOP BOTTOM' },
    { id: 46, name: 'UNDER PLAYFIELD KICKBACK' },
    { id: 47, name: 'ENTER HEAD' },

    { id: 51, name: 'SPINNER' },
    { id: 52, name: 'SHOOTER' },
    { id: 53, name: 'UPPER RIGHT JET BUMPER' },
    { id: 54, name: 'UPPER LEFT JET BUMPER' },
    { id: 55, name: 'LOWER JET BUMPER' },
    { id: 56, name: 'JET BUMPER SLING' },
    { id: 57, name: 'LEFT SLINGSHOT' },
    { id: 58, name: 'RIGHT SLINGSHOT' },

    { id: 63, name: 'HEAD LEFT EYE' },
    { id: 64, name: 'HEAD RIGHT EYE' },
    { id: 65, name: 'HEAD MOUTH' },
    { id: 67, name: 'FACE POSITION' },

    { id: 71, name: 'WIREFORM TOP' },
    { id: 72, name: 'WIREFORM BOTTOM' },
    { id: 73, name: 'ENTER MINI PLAYFIELD' },
    { id: 74, name: 'MINI EXIT LEFT' },
    { id: 75, name: 'MINI EXIT RIGHT' },
    { id: 76, name: 'LEFT RAMP ENTER' },
    { id: 77, name: 'RIGHT RAMP ENTER' },

  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-bop.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcAlphanumeric',
  ],
  cabinetColors: [
    '#F6D64A',
    '#CF4330',
    '#D2D2D1',
  ],
  initialise: {
    closedSwitches: [
      //OPTO 23
      22, 23,
      25, 26, 27,
    ],
    initialAction: [
      {
        delayMs: 1500,
        source: 'cabinetInput',
        value: 16
      },
    ],
  },
  memoryPosition: {
    checksum: [
    ],
    knownValues: [
    ]
  },
  testErrors: [
    'HEAD MOTOR AND/OR SWITCH ERROR',
  ],
};
