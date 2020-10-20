'use strict';

module.exports = {
  name: 'WPC-95: Scared Stiff',
  version: '1.5',
  pinmame: {
    knownNames: [ 'ss_01', 'ss_01b', 'ss_03', 'ss_12', 'ss_14', 'ss_15' ],
    gameName: 'Scared Stiff',
    id: 'ss',
  },
  rom: {
    u06: 'SS_G11.1_5',
  },
  switchMapping: [
    { id: 12, name: 'WHEEL INDEX' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RT FLIPPER LANE' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 25, name: 'EXTRA BALL LANE' },
    { id: 26, name: 'LFT FLIPPER LANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'SINGLE STANDUP' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'RIGHT POPPER' },
    { id: 37, name: 'LEFT KICKOUT' },
    { id: 38, name: 'CRATE ENTERANCE' },

    { id: 41, name: 'COFFIN LEFT' },
    { id: 42, name: 'COFFIN CENTER' },
    { id: 43, name: 'COFFIN RIGHT' },
    { id: 44, name: 'LEFT RAMP ENTER' },
    { id: 45, name: 'RIGHT RAMP ENTER' },
    { id: 46, name: 'LEFT RAMP MADE' },
    { id: 47, name: 'RIGHT RAMP MADE' },
    { id: 48, name: 'COFFIN ENTERANCE' },

    { id: 51, name: 'LEFT SLINGSHOT' },
    { id: 52, name: 'RIGHT SLINGSHOT' },
    { id: 53, name: 'UPPER JET' },
    { id: 54, name: 'CENTER JET' },
    { id: 55, name: 'LOWER JET' },
    { id: 56, name: 'UPPER SLINGSHOT' },
    { id: 57, name: 'CRATE SENSOR' },
    { id: 58, name: 'LEFT LOOP' },

    { id: 61, name: 'THREE BANK UPPER' },
    { id: 62, name: 'THREE BANK MID' },
    { id: 63, name: 'THREE BANK LOWER' },
    { id: 64, name: 'LEFT LEAPER' },
    { id: 65, name: 'CENTER LEAPER' },
    { id: 66, name: 'RIGHT LEAPER' },
    { id: 67, name: 'RT RAMP 10 POINT' },
    { id: 68, name: 'RIGHT ROOP' },

    { id: 71, name: 'LEFT SKULL LANE' },
    { id: 72, name: 'CNTR SKULL LANE' },
    { id: 73, name: 'RIGHT SKULL LANE' },
    { id: 74, name: 'SECRET PASSAGE' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
    { id: 'F8', name: 'UL FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-ss.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#8CA5AE',
    '#71AD5A',
    '#C74641',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
      31, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
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
        offset: 0x1C7C,
        value: 0x01,
      },
    ],
  },
  memoryPosition: {
    checksum: [
      { dataStartOffset: 0x1BFE, dataEndOffset: 0x1CEE, checksumOffset: 0x1CEF, checksum: '16bit', name: 'ADJUSTMENT' },
    ],
    knownValues: [
      { offset: 0x80, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x43D, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },
      { offset: 0x589, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

      { offset: 0x169F, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x16A6, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x16AD, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x16B4, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

      { offset: 0x170D, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

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

      { offset: 0x1BFE, name: 'GAME_BALL_TOTAL', description: 'Balls per game', type: 'uint8' },
      { offset: 0x1C7C, name: 'STAT_FREEPLAY', description: '0: not free, 1: free', type: 'uint8' },

      { offset: 0x1D57, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D5B, name: 'HISCORE_1_SCORE', type: 'bcd', length: 4 },
      { offset: 0x1D5F, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D63, name: 'HISCORE_2_SCORE', type: 'bcd', length: 4 },
      { offset: 0x1D67, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D6B, name: 'HISCORE_3_SCORE', type: 'bcd', length: 4 },
      { offset: 0x1D6F, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D73, name: 'HISCORE_4_SCORE', type: 'bcd', length: 4 },
      { offset: 0x1D79, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D7D, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 4 },
      //TEX 0x1FDC

      { offset: 0x1D89, name: 'GAME_CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1D8A, name: 'GAME_CREDITS_HALF', description: '0: no half credits', type: 'uint8' },

    ]
  },
};
