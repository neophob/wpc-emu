'use strict';

module.exports = {
  name: 'WPC-95: The Champion Pub',
  version: '1.6',
  pinmame: {
    knownNames: [ 'cp_15', 'cp_16' ],
    gameName: 'Champion Pub, The',
    id: 'cp',
  },
  rom: {
    u06: 'CP_G11.1_6',
  },
  switchMapping: [
    { id: 11, name: 'MADE RAMP' },
    { id: 12, name: 'HEAVY BAG' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LOCK UP 1' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT RETURN' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BALL LAUNCH' },
    { id: 25, name: 'THREE BANK MID' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'POPPER' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LEFT JAB MADE' },
    { id: 37, name: 'CORNER EJECT' },
    { id: 38, name: 'RIGHT JAB MADE' },

    { id: 41, name: 'BOXER POLE CNTR' },
    { id: 42, name: 'BEHND LEFT SCOOP' },
    { id: 43, name: 'BEHND RGHT SCOOP' },
    { id: 44, name: 'ENTER RAMP' },
    { id: 45, name: 'JUMP ROPE' },
    { id: 46, name: 'BAG POLE CENTER' },
    { id: 47, name: 'BOXER POLE RIGHT' },
    { id: 48, name: 'BOXER POLE LEFT' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'THREE BANK BOTTO' },
    { id: 54, name: 'THREE BANK TOP' },
    { id: 55, name: 'LEFT HALF GUY' },
    { id: 56, name: 'RGHT HALD GUY' },
    { id: 57, name: 'LOCK UP 2' },
    { id: 58, name: 'LOCK UP 3' },

    { id: 61, name: 'LEFT SCOOP UP' },
    { id: 62, name: 'RIGHT SCOOP UP' },
    { id: 63, name: 'POWER SHOT' },
    { id: 64, name: 'ROPE CAM' },
    { id: 65, name: 'SPEED BAG' },
    { id: 66, name: 'BOXER GUT 1' },
    { id: 67, name: 'BOXER GUT 2' },
    { id: 68, name: 'BOXER HEAD' },

    { id: 71, name: 'EXIT ROPE' },
    { id: 72, name: 'ENTER SPEED BAG' },
    { id: 73, name: 'REMOVED' },
    { id: 74, name: 'ENTER LOCKUP' },
    { id: 75, name: 'SWITCH 75' },
    { id: 76, name: 'TOP OF RAMP' },
    { id: 77, name: 'SWITCH 77' },
    { id: 78, name: 'ENTER ROPE' },
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
    image: 'playfield-tcp.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#E76031',
    '#ECCA9E',
    '#497A9B',
    '#CC2D1E',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 38, 41, 42, 43, 44, 45, 46, 47, 48, 64
      31, 36, 38, 41, 42, 43, 44, 45, 46, 47, 48, 64,
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
