'use strict';

module.exports = {
  name: 'WPC-S: Johnny Mnemonic',
  version: '1.2 R',
  rom: {
    u06: 'john1_2r.rom',
  },
  switchMapping: [
    //TODO
    { id: 11, name: 'BALL LAUNCH' },
    { id: 12, name: 'X HAND HOME' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT OUTLANE' },
    { id: 16, name: 'LEFT FLIP. LANE' },
    { id: 17, name: 'RIGHT FLIP. LANE' },
    { id: 18, name: 'RIGHT OUTLANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY IN BUTTON' },
    { id: 25, name: 'L SLINGSHOT' },
    { id: 26, name: 'R SLINGSHOT' },
    { id: 27, name: 'L STANDUP' },
    { id: 28, name: 'R STANDUP' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'POPPER BALL 1' },
    { id: 37, name: 'Y HAND HOME' },
    { id: 38, name: 'R RUBBER' },

    { id: 41, name: 'LEFT RAMP ENTER' },
    { id: 42, name: 'LEFT RAMP MADE' },
    { id: 43, name: 'DROP TARGET' },
    { id: 44, name: 'LEFT JET' },
    { id: 45, name: 'BOTTOM JET' },
    { id: 46, name: 'RIGHT JET' },
    { id: 47, name: 'CRAZ BOB\'S' },
    { id: 48, name: 'SPINNER' },

    { id: 51, name: 'CYBER MATRIX 11' },
    { id: 52, name: 'CYBER MATRIX 21' },
    { id: 53, name: 'CYBER MATRIX 31' },
    { id: 54, name: 'RIGHT RAMP ENTER' },
    { id: 55, name: 'RIGHT RAMP MADE' },
    { id: 56, name: 'LEFT LOOP' },
    { id: 57, name: 'RIGHT LOOP' },
    { id: 58, name: 'INNER LOOP ENTRY' },

    { id: 61, name: 'CYBER MATRIX 12' },
    { id: 62, name: 'CYBER MATRIX 22' },
    { id: 63, name: 'CYBER MATRIX 32' },
    { id: 64, name: 'LEFT JET LANE' },
    { id: 65, name: 'MIDDLE JET LANE' },
    { id: 66, name: 'RIGHT JET LANE' },
    { id: 67, name: 'R HAND CONTROL' },
    { id: 68, name: 'L HAND CONTROL' },

    { id: 71, name: 'CYBER MATRIX 13' },
    { id: 72, name: 'CYBER MATRIX 23' },
    { id: 73, name: 'CYBER MATRIX 33' },
    { id: 74, name: 'X HAND ENCODER A' },
    { id: 75, name: 'X HAND ENCODER B' },
    { id: 76, name: 'Y HAND ENCODER B' },
    { id: 77, name: 'Y HAND ENCODER A' },
    { id: 78, name: 'SHOOTER LANE' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'BALL IN HAND' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-jm.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  initialise: {
    closedSwitches: [
      12, 22, 43,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 74, 75, 76, 77
      31, 36, 76,
      'F2', 'F4', 'F6', 'F8',
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  },
  memoryPosition: [
    { offset: 0x80, name: 'GAME_RUN', description: '0: not running, 1: running', type: 'uint8' },

    { offset: 0x3B2, name: 'PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
    { offset: 0x3B3, name: 'BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

    { offset: 0x16A0, name: 'SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
    { offset: 0x16A7, name: 'SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
    { offset: 0x16AE, name: 'SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
    { offset: 0x16B5, name: 'SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

    { offset: 0x1711, name: 'PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

    { offset: 0x1B20, name: 'BALL_TOTAL', description: 'Balls per game', type: 'uint8' },

    { offset: 0x1C61, name: 'HI_SCORE_1_NAME', type: 'string' },
    { offset: 0x1C64, name: 'HI_SCORE_1_SCORE', type: 'bcd', length: 6 },
    { offset: 0x1C6A, name: 'HI_SCORE_2_NAME', type: 'string' },
    { offset: 0x1C6D, name: 'HI_SCORE_2_SCORE', type: 'bcd', length: 6 },
    { offset: 0x1C73, name: 'HI_SCORE_3_NAME', type: 'string' },
    { offset: 0x1C76, name: 'HI_SCORE_3_SCORE', type: 'bcd', length: 6 },
    { offset: 0x1C7C, name: 'HI_SCORE_4_NAME', type: 'string' },
    { offset: 0x1C7F, name: 'HI_SCORE_4_SCORE', type: 'bcd', length: 6 },
    { offset: 0x1C87, name: 'CHAMPION_1_NAME', description: 'Grand Champion', type: 'string' },
    { offset: 0x1C8A, name: 'CHAMPION_1_SCORE', description: 'Grand Champion', type: 'bcd', length: 6 },

    { offset: 0x1C98, name: 'CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
    { offset: 0x1C99, name: 'CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
  ],
};
