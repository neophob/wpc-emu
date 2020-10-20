'use strict';

module.exports = {
  name: 'WPC-S: Corvette (FreeWPC)',
  version: '0.61',
  pinmame: {
    knownNames: [ 'corv_f61' ],
    gameName: 'Corvette (FreeWPC 0.61)',
    id: 'f61',
  },
  rom: {
    u06: 'corf0_61.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'PLUNGER' },
    { id: 16, name: 'L RETURN LANE' },
    { id: 17, name: 'R RETURN LANE' },
    { id: 18, name: 'SPINNER' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: '1ST GEAR (OPT)' },
    { id: 26, name: '2ND GEAR (OPT)' },
    { id: 27, name: '3RD GEAR (OPT)' },
    { id: 28, name: '4TH GEAR (OPT)' },

    { id: 31, name: 'TROUGH BALL 1' },
    { id: 32, name: 'TROUGH BALL 2' },
    { id: 33, name: 'TROUGH BALL 3' },
    { id: 34, name: 'TROUGH BALL 4' },
    { id: 35, name: 'ROUTE 66 ENTRY' },
    { id: 36, name: 'PIT STOP POPPER' },
    { id: 37, name: 'TROUGH EJECT' },
    { id: 38, name: 'INNER LOOP ENTRY' },

    { id: 41, name: 'ZR1 BOTTOM ENTRY' },
    { id: 42, name: 'ZR1 TOP ENTRY' },
    { id: 43, name: 'SKID PAD ENTRY' },
    { id: 44, name: 'SKID PAD EXIT' },
    { id: 45, name: 'ROUTE 66 EXIT' },
    { id: 46, name: 'L STANDUP 3' },
    { id: 47, name: 'L STANDUP 2' },
    { id: 48, name: 'L STANDUP 1' },

    { id: 51, name: 'L RACE START' },
    { id: 52, name: 'R RACE START' },
    { id: 55, name: 'L RACE ENCODER' },
    { id: 56, name: 'R RACE ENCODER' },
    { id: 57, name: 'ROUTE 66 KICKOUT' },
    { id: 58, name: 'SKID RTE66 EXIT' },

    { id: 61, name: 'L SLINGSHOT' },
    { id: 62, name: 'R SLINGSHOT' },
    { id: 63, name: 'LEFT JET' },
    { id: 64, name: 'BOTTOM JET' },
    { id: 65, name: 'RIGHT JET' },
    { id: 66, name: 'L ROLLOVER' },
    { id: 67, name: 'M ROLLOVER' },
    { id: 68, name: 'R ROLLOVER' },

    { id: 71, name: 'ZR1 FULL LEFT' },
    { id: 72, name: 'ZR1 FULL RIGHT' },
    { id: 75, name: 'ZR1 EXIT' },
    { id: 76, name: 'ZR1 LOCK BALL 1' },
    { id: 77, name: 'ZR1 LOCK BALL 2' },
    { id: 78, name: 'ZR1 LOCK BALL 3' },

    { id: 81, name: 'MILLION STANDUP' },
    { id: 82, name: 'SKID PAD STANDUP' },
    { id: 83, name: 'R STANDUP' },
    { id: 84, name: 'R RUBBER' },
    { id: 86, name: 'JET RUBBER' },
    { id: 87, name: 'L OUTER LOOP' },
    { id: 88, name: 'R OUTER LOOP' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-corv.jpg',
  },
  skipWpcRomCheck: false,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#DBBD5C',
    '#C53A36',
    '#9A3F75',
    '#8490C3',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 51, 52, 55, 56, 71, 72
      35, 36, 37, 41, 42, 43, 51, 52, 55, 56, 71, 72,
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  },
};
