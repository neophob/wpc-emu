'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Bram Stoker\'s Dracula',
  version: 'L-1',
  pinmame: {
    knownNames: [ 'drac_p11', 'drac_p12', 'drac_l1', 'drac_d1', 'drac_l2c' ],
    gameName: 'Bram Stoker\'s Dracula',
    id: 'drac',
  },
  rom: {
    u06: 'dracu_l1.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'L DROP TARGET' },
    { id: 16, name: 'L DROP SCORE' },
    { id: 17, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'TOP 3LANE L' },
    { id: 26, name: 'TOP 3LANE M' },
    { id: 27, name: 'TOP 3LANE R' },
    { id: 28, name: 'R RAMP SCORE' },

    { id: 31, name: 'UNDER SHOOT RAMP' },
    { id: 34, name: 'LAUNCH BALL' },
    { id: 35, name: 'LEFT DRAIN' },
    { id: 36, name: 'LEFT RETURN' },
    { id: 37, name: 'RIGHT RETURN' },
    { id: 38, name: 'RIGHT DRAIN' },

    { id: 41, name: 'TROUGH 1 BALL' },
    { id: 42, name: 'TROUGH 2 BALLS' },
    { id: 43, name: 'TROUGH 3 BALLS' },
    { id: 44, name: 'TROUGH 4 BALLS' },
    { id: 48, name: 'OUTHOLE' },

    { id: 51, name: 'OPTO TR LANE' },
    { id: 52, name: 'OPTO MAG LPOCKET' },
    { id: 53, name: 'OPTO CASTLE 1' },
    { id: 54, name: 'OPTO CASTLE 2' },
    { id: 55, name: 'OPTO BL POPPER' },
    { id: 56, name: 'OPTO TL POPPER' },
    { id: 57, name: 'OPTO CASTLE 3' },
    { id: 58, name: 'MYSTERY HOLE' },

    { id: 61, name: 'LEFT JET' },
    { id: 62, name: 'RIGHT JET' },
    { id: 63, name: 'BOTTOM JET' },
    { id: 64, name: 'LEFT SLING' },
    { id: 65, name: 'RIGHT SLING' },
    { id: 66, name: 'LEFT 3BANK T' },
    { id: 67, name: 'LEFT 3BANK M' },
    { id: 68, name: 'LEFT 3BANK B' },

    { id: 71, name: 'OPTO CASTLE POP' },
    { id: 72, name: 'OPTO COFFIN POP' },
    { id: 73, name: 'OPTO LRAMP ENTRY' },
    { id: 77, name: 'R RAMP UP' },

    { id: 81, name: 'MAGNET LEFT' },
    { id: 82, name: 'BALL ON MAGNET' },
    { id: 83, name: 'MAGNET RIGHT' },
    { id: 84, name: 'L RAMP SCORE' },
    { id: 85, name: 'L RAMP DIVERTED' },
    { id: 86, name: 'MID 3BANK L' },
    { id: 87, name: 'MID 3BANK M' },
    { id: 88, name: 'MID 3BANK R' },
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
    image: 'playfield-bsd.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  cabinetColors: [
    '#D43A33',
    '#5DACDD',
    '#E85D2B',
    '#5A4383',
  ],
  initialise: {
    closedSwitches: [
      22,
      41, 42, 43, 44,
      51, 53, 54, 55, 56, 57, 71, 72, 73,
      81,
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
      { offset: 0x88, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x3F7, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x1680, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x1686, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x168C, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x1692, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

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

      { offset: 0x1D17, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D1A, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D1F, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D22, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D27, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D2A, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D2F, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D32, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D39, name: 'HISCORE_CHAMP_NAME', description: 'Greatest Vampire Hunter', type: 'string' },
      { offset: 0x1D3C, name: 'HISCORE_CHAMP_SCORE', description: 'Greatest Vampire Hunter', type: 'bcd', length: 5 },
    ]
  },
};
