'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Dr. Who',
  version: 'L-1',
  pinmame: {
    knownNames: [ 'dw_p5', 'dw_p6', 'dw_l1', 'dw_d1', 'dw_l2', 'dw_d2' ],
    gameName: 'Dr. Who',
    id: 'dw',
  },
  rom: {
    u06: 'drwho_l2.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT SLING' },
    { id: 16, name: 'RIGHT SLING' },
    { id: 17, name: 'SHOOTER LANE' },
    { id: 18, name: 'EXIT JETS' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKET OPTQ' },
    { id: 25, name: 'TROUGH 1 BALL' },
    { id: 26, name: 'TROUGH 2 BALLS' },
    { id: 27, name: 'TROUGH 3 BALLS' },
    { id: 28, name: 'OUTHOLE' },

    { id: 31, name: 'OPTO POPPER' },
    { id: 32, name: 'MINI HOME OPTO' },
    { id: 33, name: 'ENTER TRAMP OPTO' },
    { id: 34, name: 'LAUNCH BALL' },
    { id: 35, name: 'SCORE TOP RAMP' },
    { id: 36, name: 'ENTER BOT RAMP' },
    { id: 37, name: 'SCORE BOT RAMP' },
    { id: 38, name: 'MINI DOOR MID' },

    { id: 41, name: '<E>S-C-A-P-E' },
    { id: 42, name: 'E<S>C-A-P-E' },
    { id: 43, name: 'E-S<C>A-P-E' },
    { id: 44, name: 'E-S-C<A>P-E' },
    { id: 45, name: 'E-S-C-A<P>E' },
    { id: 46, name: 'E-S-C-A-P<E>' },
    { id: 47, name: 'HANGON SCORE' },
    { id: 48, name: 'SELECT DOCTOR' },

    { id: 51, name: '<R>E-P-A-I-R' },
    { id: 52, name: 'R<E>P-A-I-R' },
    { id: 53, name: 'R-E<P>A-I-R' },
    { id: 54, name: 'R-E-P<A>I-R' },
    { id: 55, name: 'R-E-P-A<I>R' },
    { id: 56, name: 'R-E-P-A-I<R>' },
    { id: 57, name: 'TRAP DOOR DOWN' },
    { id: 58, name: 'ACTIVAT TRANSMAT' },

    { id: 61, name: 'LEFT JET' },
    { id: 62, name: 'RIGHT JET' },
    { id: 63, name: 'BOTTOM JET' },
    { id: 64, name: 'LEFT DRAIN' },
    { id: 65, name: 'LEFT RETURN' },
    { id: 66, name: 'RIGHT RETURN' },
    { id: 67, name: 'RIGHT DRAIN' },
    { id: 68, name: 'MINI DOOR LEFT' },

    { id: 71, name: 'MINIOPTO5BANK R1' },
    { id: 72, name: 'MINIOPTO5BANK R2' },
    { id: 73, name: 'MINIOPTO5BANK M' },
    { id: 74, name: 'MINIOPTO5BANK L2' },
    { id: 75, name: 'MINIOPTO5BANK L1' },
    { id: 76, name: 'MINI L OPTOEJECT' },
    { id: 77, name: 'MINI R OPTOEJECT' },
    { id: 78, name: 'MINI LITES LOCK' },

    { id: 82, name: 'PLAYFIELD GLASS' },
    { id: 88, name: 'MINI DOOR RIGHT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-dw.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  initialise: {
    closedSwitches: [
      22, 25, 26, 27,
      82,
      //OPTO SWITCHES
      31, 32, 33, 71, 72, 73, 74, 75, 76, 77,
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
