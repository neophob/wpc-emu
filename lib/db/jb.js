'use strict';

module.exports = {
  name: 'WPC-S: Jack·Bot',
  version: '1.0R',
  pinmame: {
    knownNames: [ 'jb_10r', 'jb_101r', 'jb_10b', 'jb_101b' ],
    gameName: 'Jack*Bot',
    id: 'jb',
  },
  rom: {
    u06: 'jack1_0r.rom',
  },
  switchMapping: [
    { id: 11, name: 'L LEFT 10 POINT' },
    { id: 12, name: 'U LEFT 10 POINT' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RAMP IS DOWN' },
    { id: 16, name: 'HIGH DROP TARGET' },
    { id: 17, name: 'CENT DROP TARGET' },
    { id: 18, name: 'LOW DROP TARGET' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY EXTRA BALL' },
    { id: 25, name: 'LEFT OUTLANE' },
    { id: 26, name: 'L FLIPPER LANE' },
    { id: 27, name: 'R FLIPPER LANE' },
    { id: 28, name: 'RIGHT OUTLANE' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1 (RIGHT)' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4 (LEFT)' },
    { id: 36, name: 'RAMP EXIT' },
    { id: 37, name: 'RAMP ENTRANCE' },
    { id: 38, name: 'TARG UNDER RAMP' },

    { id: 41, name: 'VISOR 1 (LEFT)' },
    { id: 42, name: 'VISOR 2' },
    { id: 43, name: 'VISOR 3' },
    { id: 44, name: 'VISOR 4' },
    { id: 45, name: 'VISOR 5 (RIGHT)' },
    { id: 46, name: 'GAME SAUCER' },
    { id: 47, name: 'LEFT EJECT HOLE' },
    { id: 48, name: 'RIGHT EJECT HOLE' },

    { id: 51, name: '5-BANK 1 (UPPER)' },
    { id: 52, name: '5-BANK TARGET 2' },
    { id: 53, name: '5-BANK TARGET 3' },
    { id: 54, name: '5-BANK TARGET 4' },
    { id: 55, name: '5-BANK 5 (LOWER)' },
    { id: 56, name: 'VORTEX UPPER' },
    { id: 57, name: 'VORTEX CENTER' },
    { id: 58, name: 'VORTEX LOWER' },

    { id: 61, name: 'UPPER JET BUMPER' },
    { id: 62, name: 'LEFT JET BUMPER' },
    { id: 63, name: 'LOWER JET BUMPER' },
    { id: 64, name: 'RIGHT SLINGSHOT' },
    { id: 65, name: 'LEFT SLINGSHOT' },
    { id: 66, name: 'RIGHT 10 POINT' },
    { id: 67, name: 'HIT ME TARGET' },
    { id: 68, name: 'BALL SHOOTER' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'VISOR IS CLOSED' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'VISOR IS OPEN' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-jackbot.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#F9DF4C',
    '#E53F28',
    '#888888',
    '#DA6C2A',
  ],
  initialise: {
    closedSwitches: [
      22, 31,
      //OPTO SWITCHES: 16, 17, 18, 41, 42, 43, 44, 45
      16, 17, 18,
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
  memoryPosition: {
    knownValues: [
      { offset: 0x7A, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x16A1, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x16A7, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x16AD, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x16B3, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

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

      { offset: 0x1D5F, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D63, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D68, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D6C, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D71, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D75, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D7A, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D7E, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D85, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D89, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
