'use strict';

module.exports = {
  name: 'WPC-95: No Good Gofers',
  version: '1.3',
  pinmame: {
    knownNames: [ 'ngg_p06', 'ngg_10', 'ngg_12', 'ngg_13' ],
    gameName: 'No Good Gofers',
    id: 'ngg',
  },
  rom: {
    u06: 'go_g11.1_3',
  },
  switchMapping: [
    { id: 12, name: 'LEFT RAMP MAKE' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'CENTER RAMP MAKE' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'SHOOTER GROOVE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'JET ADV STANDUP' },
    { id: 25, name: 'UNDERGROUND PASS' },
    { id: 26, name: 'LEFT INLANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'KICKBACK' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'TROUGH BALL 5' },
    { id: 37, name: 'TROUGH BALL 6' },
    { id: 38, name: 'JET POPPER' },

    { id: 41, name: 'L GOFER DOWN' },
    { id: 42, name: 'R GOFER DOWN' },
    { id: 44, name: 'PUTT OUT POPPER' },
    { id: 45, name: 'RGT POPPER JAM' },
    { id: 46, name: 'RIGHT POPPER' },
    { id: 47, name: 'LEFT RAMP DOWN' },
    { id: 48, name: 'RIGHT RAMP DOWN' },

    { id: 51, name: 'LEFT SLINGSHOT' },
    { id: 52, name: 'RIGHT SLINGSHOT' },
    { id: 53, name: 'TOP JET' },
    { id: 54, name: 'MIDDLE JET' },
    { id: 55, name: 'BOTTOM JET' },
    { id: 56, name: 'TOP SKILL SHOT' },
    { id: 57, name: 'MID SKILL SHOT' },
    { id: 58, name: 'LOWER SKILL SHOT' },

    { id: 61, name: 'LEFT SPINNER' },
    { id: 62, name: 'RIGHT SPINNER' },
    { id: 63, name: 'INNER WHEEL OPTO' },
    { id: 64, name: 'OUTER WHEEL OPTO' },
    { id: 65, name: 'LEFT GOFER 1' },
    { id: 66, name: 'LEFT GOFER 2' },
    { id: 67, name: 'BEHIND L GOFER' },
    { id: 68, name: 'HOLE IN 1 MADE' },

    { id: 71, name: 'LEFT CART PATH' },
    { id: 72, name: 'RIGHT CART PATH' },
    { id: 73, name: 'RIGHT RAMP MAKE' },
    { id: 74, name: 'GOLF CART' },
    { id: 75, name: 'RIGHT GOFER 1' },
    { id: 76, name: 'RIGHT GOFER 2' },
    { id: 77, name: 'ADV TRAP VALUE' },
    { id: 78, name: 'SAND TRAP EJECT' },

    { id: 81, name: 'K-I-C-K ADVANCE' },
    { id: 82, name: '(K)ICK' },
    { id: 83, name: 'K(I)CK' },
    { id: 84, name: 'KI(C)K' },
    { id: 85, name: 'KIC(K)' },
    { id: 86, name: 'CAPTIVE BALL' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-ngg.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 44, 45, 46, 63, 64
      31, 38, 41, 42, 44, 45, 46, 63, 64,
      'F2', 'F4', 'F6', 'F8',
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      },
      {
        description: 'enable free play',
        delayMs: 3000,
        source: 'writeMemory',
        offset: 0x1BDC,
        value: 0x01,
      },
    ],
  },
  memoryPosition: {
    checksum: [
      { dataStartOffset: 0x1CC3, dataEndOffset: 0x1CE6, checksumOffset: 0x1CE7, checksum: '16bit', name: 'HI_SCORE' },
      { dataStartOffset: 0x1CE9, dataEndOffset: 0x1CF1, checksumOffset: 0x1CF2, checksum: '16bit', name: 'CHAMPION' },
      { dataStartOffset: 0x1B5C, dataEndOffset: 0x1C5A, checksumOffset: 0x1C5B, checksum: '16bit', name: 'ADJUSTMENT' },
    ],
    knownValues: [
      { offset: 0x86, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x3B8, name: 'GAME_PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x3B9, name: 'GAME_BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

      { offset: 0x45E, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x59A, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

      { offset: 0x16A0, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x16A7, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x16AE, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x16B5, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

      { offset: 0x1719, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

      { offset: 0x180C, name: 'STAT_GAME_ID', type: 'string' },
      { offset: 0x1883, name: 'STAT_GAMES_STARTED', type: 'uint8', length: 3 },
      { offset: 0x1889, name: 'STAT_TOTAL_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x188F, name: 'STAT_TOTAL_FREE_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x18BF, name: 'STAT_MINUTES_ON', description: 'Minutes powered on', type: 'uint8', length: 3 },
      { offset: 0x18B9, name: 'STAT_PLAYTIME', description: 'Minutes playing', type: 'uint8', length: 5 },
      { offset: 0x18C5, name: 'STAT_BALLS_PLAYED', type: 'uint8', length: 5 },
      { offset: 0x18CB, name: 'STAT_TILT_COUNTER', type: 'uint8', length: 5 },
      { offset: 0x18E9, name: 'STAT_1_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18EF, name: 'STAT_2_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18F5, name: 'STAT_3_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18FB, name: 'STAT_4_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },

      { offset: 0x1913, name: 'STAT_LEFT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x1919, name: 'STAT_RIGHT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x19FD, name: 'STAT_LEFT_FLIPPER_TRIG', type: 'uint8', length: 3 },
      { offset: 0x1A03, name: 'STAT_RIGHT_FLIPPER_TRIG', type: 'uint8', length: 3 },

      //{ offset: 0x326, name: 'TEXT', description: 'random visible text', type: 'string' },
      { offset: 0x1B5C, name: 'GAME_BALL_TOTAL', description: 'Balls per game', type: 'uint8' },
      { offset: 0x1BDC, name: 'STAT_FREEPLAY', description: '0: not free, 1: free', type: 'uint8' },

      { offset: 0x1CC3, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1CC6, name: 'HISCORE_1_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1CCC, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1CCF, name: 'HISCORE_2_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1CD5, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1CD8, name: 'HISCORE_3_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1CDE, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1CE1, name: 'HISCORE_4_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1CE9, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1CEC, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 6 },

      { offset: 0x1CFA, name: 'GAME_CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1CFB, name: 'GAME_CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
    ]
  },
};
