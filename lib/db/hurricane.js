'use strict';

module.exports = {
  name: 'WPC-DMD: Hurricane',
  version: 'L-2',
  pinmame: {
    knownNames: [ 'hurr_l2', 'hurr_d2' ],
    gameName: 'Hurricane',
    id: 'hurr',
    vpdbId: 'hurricane',
  },
  rom: {
    u06: 'hurcnl_2.rom',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT FLIPPER' },
    { id: 12, name: 'LEFT FLIPPER' },
    { id: 13, name: 'CREDIT BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'OUTHOLE' },
    { id: 16, name: 'TROUGH 1' },
    { id: 17, name: 'TROUGH 2' },
    { id: 18, name: 'TROUGH 3' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'RIGHT SLING' },
    { id: 26, name: 'RIGHT RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'BALL SHOOTER' },

    { id: 31, name: 'FERRIS WHEEL' },
    { id: 33, name: 'L DROP 1' },
    { id: 34, name: 'L DROP 2' },
    { id: 35, name: 'L DROP 3' },
    { id: 36, name: 'LEFT SLING' },
    { id: 37, name: 'LEFT RETURN' },
    { id: 38, name: 'LEFT OUTLANE' },

    { id: 42, name: 'RIGHT STANDUP 1' },
    { id: 43, name: 'RIGHT STANDUP 2' },
    { id: 44, name: 'RIGHT STANDUP 3' },
    { id: 45, name: 'RIGHT STANDUP 4' },

    { id: 51, name: 'LEFT JET' },
    { id: 52, name: 'RIGHT JET' },
    { id: 53, name: 'BOTTOM JET' },
    { id: 55, name: 'DUNK THE DUMMY' },
    { id: 56, name: 'LEFT JUGGLER' },
    { id: 57, name: 'RIGHT JUGGLER' },

    { id: 61, name: 'HURRICANE ENTRY' },
    { id: 62, name: 'HURRICANE EXIT' },
    { id: 63, name: 'COMET ENTRY' },
    { id: 64, name: 'COMET EXIT' },
  ],
  solenoidMapping: [
    { id: 1, name: 'BACKBOX MOTOR' },
    { id: 2, name: 'LEFT BANK' },
    { id: 4, name: 'LEFT JUGGLER' },
    { id: 5, name: 'RIGHT JUGGLER' },
    { id: 6, name: 'FERRIS WHEELS' },
    { id: 7, name: 'KNOCKER' },
    { id: 9, name: 'OUTHOLE' },
    { id: 10, name: 'BALL RELEASE' },
    { id: 11, name: 'LEFT SLING' },
    { id: 12, name: 'RIGHT SLING' },
    { id: 13, name: 'LEFT JET' },
    { id: 14, name: 'RIGHT JET' },
    { id: 15, name: 'BOTTOM JET' },
    { id: 15, name: 'BOTTOM JET' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-hurricane.jpg',
    lamps: [
      [{ x: 82, y: 312, color: 'YELLOW' }],
      [{ x: 98, y: 312, color: 'YELLOW' }],
      [{ x: 74, y: 325, color: 'ORANGE' }],
      [{ x: 91, y: 322, color: 'RED' }],
      [{ x: 107, y: 325, color: 'ORANGE' }],
      [{ x: 91, y: 338, color: 'RED' }], // CLOWN MOUTH
      [{ x: 10, y: 288, color: 'ORANGE' }], //LEFT OUTLANE
      [{ x: 26, y: 288, color: 'ORANGE' }], // LEFT RETURN LANE

      [{ x: 77, y: 295, color: 'LBLUE' }],
      [{ x: 67, y: 285, color: 'LBLUE' }],
      [{ x: 59, y: 277, color: 'LBLUE' }],
      [{ x: 54, y: 269, color: 'LBLUE' }],
      [{ x: 45, y: 261, color: 'LBLUE' }],
      [{ x: 32, y: 220, color: 'GREEN' }],
      [{ x: 35, y: 208, color: 'GREEN' }],
      [{ x: 37, y: 197, color: 'GREEN' }],

      [{ x: 67, y: 265, color: 'WHITE' }],
      [{ x: 75, y: 272, color: 'WHITE' }],
      [{ x: 85, y: 276, color: 'WHITE' }],
      [{ x: 96, y: 276, color: 'WHITE' }],
      [{ x: 106, y: 272, color: 'WHITE' }],
      [{ x: 113, y: 265, color: 'WHITE' }], //#36,PALACE E
      [{ x: 170, y: 287, color: 'ORANGE' }], //RIGHT OUTLANE
      [{ x: 155, y: 287, color: 'ORANGE' }],

      [{ x: 121, y: 244, color: 'RED' }], //#41, SPECIAL
      [{ x: 124, y: 232, color: 'ORANGE' }],
      [{ x: 127, y: 221, color: 'WHITE' }],
      [{ x: 131, y: 209, color: 'YELLOW' }],
      [{ x: 134, y: 197, color: 'WHITE' }],
      [{ x: 154, y: 108, color: 'YELLOW' }],
      [{ x: 160, y: 99, color: 'YELLOW' }],
      [{ x: 167, y: 108, color: 'YELLOW' }],

      [{ x: 56, y: 167, color: 'GREEN' }],
      [{ x: 55, y: 150, color: 'GREEN' }],
      [{ x: 56, y: 133, color: 'WHITE' }], //MYSTERY
      [{ x: 62, y: 110, color: 'YELLOW' }], //JACKPOT
      [{ x: 90, y: 371, color: 'ORANGE' }], //#55, PLAY IT AGAIN
      [{ x: 31, y: 165, color: 'WHITE' }],
      [{ x: 60, y: 45, color: 'YELLOW' }], //#57, FERRIS WHEEL - UNKNOWN
      [{ x: 87, y: 184, color: 'WHITE' }],

      [{ x: 79, y: 154, color: 'GREEN' }], //#61
      [{ x: 92, y: 153, color: 'RED' }],
      [{ x: 77, y: 141, color: 'ORANGE' }], //#63
      [{ x: 91, y: 140, color: 'WHITE' }],
      [{ x: 86, y: 92, color: 'BLACK' }],
      [{ x: 127, y: 80, color: 'BLACK' }],
      [{ x: 116, y: 120, color: 'BLACK' }],
      [{ x: 109, y: 188, color: 'LBLUE' }],

      [{ x: 91, y: 247, color: 'YELLOW' }], //#71
      [{ x: 93, y: 233, color: 'YELLOW' }],
      [{ x: 95, y: 217, color: 'YELLOW' }],
      [{ x: 80, y: 214, color: 'WHITE' }],
      [{ x: 153, y: 231, color: 'GREEN' }],
      [{ x: 151, y: 219, color: 'GREEN' }],
      [{ x: 149, y: 207, color: 'GREEN' }],
      [{ x: 147, y: 195, color: 'GREEN' }],

      [{ x: 164, y: 57, color: 'WHITE' }], // #81
      [{ x: 164, y: 30, color: 'WHITE' }],
      [{ x: 189, y: 28, color: 'WHITE' }],
      [{ x: 185, y: 59, color: 'WHITE' }],
      [{ x: 155, y: 359, color: 'WHITE' }, { x: 31, y: 359, color: 'WHITE' }],
      [{ x: 11, y: 389, color: 'YELLOW' }],
      [{ x: 39, y: 298, color: 'YELLOW' }],
      [{ x: 139, y: 298, color: 'YELLOW' }],
    ],
    flashlamps: [
      { id: 17, x: 188, y: 211, }, { id: 17, x: 188, y: 247, },
      { id: 18, x: 166, y: 14, }, { id: 18, x: 189, y: 28, },
      { id: 19, x: 95, y: 216, },
      { id: 20, x: 88, y: 185, },
      { id: 21, x: 62, y: 111, },
      { id: 22, x: 19, y: 119, },
      { id: 23, x: 13, y: 12, }, { id: 23, x: 35, y: 48, },
      { id: 24, x: 36, y: 344, },
      { id: 25, x: 138, y: 344, },
      { id: 26, x: 95, y: 112, },
      { id: 27, x: 116, y: 151, },
      { id: 28, x: 9, y: 241, },
    ],
  },
  skipWpcRomCheck: true,
  features: [
    'wpcDmd',
  ],
  cabinetColors: [
    '#B7341B',
    '#DA7E2E',
    '#FAE34C',
    '#ECBAB6',
  ],
  initialise: {
    closedSwitches: [
      16, 17, 18, 22
    ],
    initialAction: [
      {
        delayMs: 1500,
        source: 'cabinetInput',
        value: 16
      },
      {
        description: 'enable free play',
        delayMs: 3000,
        source: 'writeMemory',
        offset: 0x1B9C,
        value: 0x01,
      },
    ],
  },
  memoryPosition: {
    checksum: [
      { dataStartOffset: 0x1C4D, dataEndOffset: 0x1C6C, checksumOffset: 0x1C6D, checksum: '16bit', name: 'HI_SCORE' },
      { dataStartOffset: 0x1C6F, dataEndOffset: 0x1C76, checksumOffset: 0x1C77, checksum: '16bit', name: 'CHAMPION' },
      { dataStartOffset: 0x1B20, dataEndOffset: 0x1BE4, checksumOffset: 0x1BE5, checksum: '16bit', name: 'ADJUSTMENT' },
    ],
    knownValues: [
      { offset: 0x86, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      //{ offset: 0x323, name: 'TEXT', description: 'random visible text', type: 'string' },
      { offset: 0x3AC, name: 'GAME_PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x3AD, name: 'GAME_BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

      { offset: 0x420, name: 'GAME_CURRENT_SCREEN', description: '0x00: attract mode, 0x01: game play/system menu, 0x80: tilt warning, 0xF1: credits view', type: 'uint8' },
      { offset: 0x494, name: 'LANGUAGE', type: 'uint8' },

      { offset: 0x172F, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x1735, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x173B, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x1741, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

      { offset: 0x178C, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

      { offset: 0x180C, name: 'STAT_GAME_ID', type: 'string' },
      { offset: 0x1883, name: 'STAT_GAMES_STARTED', type: 'uint8', length: 3 },
      { offset: 0x1889, name: 'STAT_TOTAL_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x188F, name: 'STAT_TOTAL_FREE_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x18BF, name: 'STAT_MINUTES_ON', description: 'Minutes powered on', type: 'uint8', length: 3 },
      { offset: 0x18B9, name: 'STAT_PLAYTIME', description: 'Minutes playing', type: 'uint8', length: 3 },
      { offset: 0x18C5, name: 'STAT_BALLS_PLAYED', type: 'uint8', length: 3 },
      { offset: 0x18CB, name: 'STAT_TILT_COUNTER', type: 'uint8', length: 5 },
      { offset: 0x18E9, name: 'STAT_1_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18EF, name: 'STAT_2_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18F5, name: 'STAT_3_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18FB, name: 'STAT_4_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },

      { offset: 0x1913, name: 'STAT_LEFT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x1919, name: 'STAT_RIGHT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x19DF, name: 'STAT_LEFT_FLIPPER_TRIG', type: 'uint8', length: 3 },
      { offset: 0x19E5, name: 'STAT_RIGHT_FLIPPER_TRIG', type: 'uint8', length: 3 },

      //0x1B7C Pricing Option
      { offset: 0x1B20, name: 'GAME_BALL_TOTAL', description: 'Balls per game', type: 'uint8' },
      { offset: 0x1B9C, name: 'STAT_FREEPLAY', description: '0: not free, 1: free', type: 'uint8' },

      { offset: 0x1C4D, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1C50, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C55, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1C58, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C5D, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1C60, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C65, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1C68, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C6F, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1C72, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },

      { offset: 0x1C7F, name: 'GAME_CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1C80, name: 'GAME_CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
    ]
  },
};

/*
# BALL STATE HURRICANE

INITIAL STATE
- TROUGH 1, TROUGH 2 and TROUGH 3 are on (ball on switches)

BALL IN SHOOTER LANE
- TROUGH 2, TROUGH 3 and BALL SHOOTER are on

BALL IN GAME
- TROUGH 2, TROUGH 3

BALL DRAIN
- TROUGH 2, TROUGH 3, OUTHOLE on
- TROUGH 1, TROUGH 2, TROUGH 3 on
*/
