'use strict';

module.exports = {
  name: 'WPC-95: Safe Cracker',
  version: '1.8',
  rom: {
    u06: 'safe_18g.rom',
  },
  switchMapping: [
    { id: 11, name: 'TP TROUGH (ROOF)' },
    { id: 12, name: 'TP TROUGH (MOVE)' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RIGHT ORBIT' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT OUTLANE' },
    { id: 18, name: 'BALLSHOOTER' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 25, name: 'UR FLIP ROLLOVER' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'RIGHT RETURN' },
    { id: 28, name: 'LEFT ORBIT' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LOOKUP 1 FRONT' },
    { id: 37, name: 'LOOKUP 2 REAR' },

    { id: 41, name: 'KICKBACK' },
    { id: 42, name: 'LEFT BIG KICK' },
    { id: 43, name: 'TOKN CHUTE EXIT' },
    { id: 44, name: 'LEFT JET' },
    { id: 45, name: 'RIGHT JET' },
    { id: 46, name: 'TOP JET' },
    { id: 47, name: 'LEFT SLINGSHOT' },
    { id: 48, name: 'RIGHT SLINGSHOT' },

    { id: 51, name: '(A)LARM STANDUP' },
    { id: 52, name: 'A(L)ARM STANDUP' },
    { id: 53, name: 'AL(A)RM STANDUP' },
    { id: 54, name: 'ALA(R)M STANDUP' },
    { id: 55, name: 'ALAR(M) STANDUP' },
    { id: 56, name: 'MOVNG TARGET C' },
    { id: 57, name: 'MOVNG TARGET B' },
    { id: 58, name: 'MOVNG TARGET A' },

    { id: 61, name: 'TL 3BANK TOP' },
    { id: 62, name: 'TL 3BANK MIDDLE' },
    { id: 63, name: 'TL 3BANK BOTTOM' },
    { id: 64, name: 'TR 3BANK BOTTOM' },
    { id: 65, name: 'TR 3BANK MIDDLE' },
    { id: 66, name: 'TR 3BANK TOP' },
    { id: 67, name: 'TOP LEFT LANE' },
    { id: 68, name: 'TOP POPPER' },

    { id: 71, name: 'BL 3BANK TOP' },
    { id: 72, name: 'BL 3BANK MIDDLE' },
    { id: 73, name: 'BL 3BANK BOTTOM' },
    { id: 74, name: 'BR 3BANK BOTTOM' },
    { id: 75, name: 'BR 3BANK MIDDLE' },
    { id: 76, name: 'BR 3BANK TOP' },
    { id: 77, name: 'BANK KICKOUT' },
    { id: 78, name: 'TOP RIGHT LANE' },

    { id: 81, name: 'LEFT TOKEN LVL' },
    { id: 82, name: 'RIGHT TOKEN LVL' },
    { id: 83, name: 'RAMP ENTRANCE' },
    { id: 84, name: 'RAMP MADE' },
    { id: 85, name: 'WHEEL CHANNEL A' },
    { id: 86, name: 'WHEEL CHANNEL B' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'TOKEN COIN SLOT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-sc.jpg',
  },
  skipWmcRomCheck: true,
  features: [
    'securityPic',
    'wpc95'
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 61, 62, 63, 64, 65, 66, 71, 72, 73, 74, 75, 76, 85, 86
      31, 36, 37, 41, 42, 43, 61, 62, 63, 64, 65, 66, 71, 72, 73, 74, 75, 76, 85, 86,
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
