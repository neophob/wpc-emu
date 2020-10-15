'use strict';

module.exports = {
  name: 'WPC-S: The Shadow',
  version: 'LX-5',
  pinmame: {
    knownNames: [
      'ts_pa1', 'ts_pa2', 'ts_la2', 'ts_da2', 'ts_la4', 'ts_da4', 'ts_lx4', 'ts_dx4', 'ts_lx5', 'ts_dx5', 'ts_la6', 'ts_da6', 'ts_lh6', 'ts_lh6p',
      'ts_dh6', 'ts_lf6', 'ts_df6', 'ts_lm6', 'ts_dm6'
    ],
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
    '#8695F8',
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
  },
  memoryPosition: {
    knownValues: [
      { offset: 0x86, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x441, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x16A0, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x16A6, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x16AC, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x16B2, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

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

      { offset: 0x1D1E, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D21, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D26, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D29, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D2E, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D31, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D36, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D39, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D40, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D43, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
