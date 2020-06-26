'use strict';

module.exports = {
  name: 'WPC-S: The Shadow',
  version: 'LX-5',
  pinmame: {
    knownNames: [
      'ts_pa1', 'ts_pa2', 'ts_la2', 'ts_da2', 'ts_la4', 'ts_da4', 'ts_lx4', 'ts_dx4', 'ts_lx5', 'ts_dx5', 'ts_la6', 'ts_da6', 'ts_lh6', 'ts_lh6p',
      'ts_dh6', 'ts_lf6', 'ts_df6', 'ts_lm6', 'ts_dm6' ],
    gameName: 'Shadow, The',
    id: 'ts',
  },
  rom: {
    u06: 'shad_x5.rom',
  },
  switchMapping: [
    { id: 11, name: 'GUN TRIGGER' },
    { id: 12, name: 'R PHURBA CONTROL' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RIGHT OUTLANE' },
    { id: 16, name: 'RGHT RETURN LANE' },
    { id: 17, name: 'LEFT RETURN LANE' },
    { id: 18, name: 'LEFT OUTLANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: '(M)ONGOL TARGET' },
    { id: 26, name: 'M(O)NGOL TARGET' },
    { id: 27, name: 'MONGO(L) TARGET' },
    { id: 28, name: 'MONG(O)L TARGET' },

    { id: 31, name: 'LEFT RAMP ENTER' },
    { id: 32, name: 'RIGHT RAMP ENTER' },
    { id: 33, name: 'INNER SANCTUM' },
    { id: 34, name: 'L PHURBA CONTROL' },
    { id: 35, name: 'LEFT RUBBER' },
    { id: 36, name: 'MINI KICKER' },
    { id: 37, name: 'MINI LIMIT LEFT' },
    { id: 38, name: 'MINI LIMIT RIGHT' },

    { id: 41, name: 'TROUGH 1' },
    { id: 42, name: 'TROUGH 2' },
    { id: 43, name: 'TROUGH 3' },
    { id: 44, name: 'TROUGH 4' },
    { id: 45, name: 'TROUGH 5' },
    { id: 46, name: 'TOP TROUGH' },
    { id: 47, name: 'INNER LOOP ENTER' },
    { id: 48, name: 'SHOOTER' },

    { id: 51, name: 'WALL TARGET DOWN' },
    { id: 52, name: 'MO(N)GOL TARGET' },
    { id: 53, name: 'MON(G)OL TARGET' },
    { id: 54, name: 'LEFT LOOP ENTER' },
    { id: 55, name: 'BATTLE DROP DOWN' },
    { id: 56, name: 'CENTER STANDUP' },
    { id: 57, name: 'RIGHT LOOP ENTER' },
    { id: 58, name: 'MINI EXIT TUBE' },

    { id: 61, name: 'LEFT SLINGSHOT' },
    { id: 62, name: 'RIGHT SLINGSHOT' },
    { id: 63, name: 'LOCKUP RIGHT' },
    { id: 64, name: 'LOCKUP MIDDLE' },
    { id: 65, name: 'LOCKUP LEFT' },
    { id: 66, name: 'LEFT EJECT' },
    { id: 67, name: 'RIGHT EJECT' },
    { id: 68, name: 'POPPER' },

    { id: 71, name: 'MINI L STANDUP 1' },
    { id: 72, name: 'MINI L STANDUP 2' },
    { id: 73, name: 'MINI L STANDUP 3' },
    { id: 74, name: 'MINI L STANDUP 4' },
    { id: 75, name: 'LFT RMP LFT MADE' },
    { id: 76, name: 'LFT RMP RGT MADE' },
    { id: 77, name: 'RGT RMP LFT MADE' },
    { id: 78, name: 'RGT RMP RGT MADE' },

    { id: 81, name: 'MINI R STANDUP 4' },
    { id: 82, name: 'MINI R STANDUP 3' },
    { id: 84, name: 'MINI R STANDUP 1' },
    { id: 85, name: 'MINI DROP LEFT' },
    { id: 86, name: 'MINI DRP MID LFT' },
    { id: 87, name: 'MINI DRP MID RGT' },
    { id: 88, name: 'MINI DROP RIGHT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-ts.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#1D36B5',
    '#EA382D',
    '#57B034',
    '#EEB043',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 85, 86, 87, 88,
      31, 32, 33, 36, 37, 38, 46, 47, 85, 86, 87, 88,
      'F2', 'F4', 'F6',
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
