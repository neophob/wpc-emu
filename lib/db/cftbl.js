'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Creature from the Black Lagoon',
  version: 'L-4',
  pinmame: {
    knownNames: [ 'cftbl_p3', 'cftbl_l2', 'cftbl_d2', 'cftbl_l3', 'cftbl_d3', 'cftbl_l4', 'cftbl_d4', 'cftbl_l5c' ],
    gameName: 'Creature from the Black Lagoon',
    id: 'cftbl',
  },
  rom: {
    u06: 'creat_l4.rom',
  },
  switchMapping: [
    { id: 13, name: 'CREDIT BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'TOP LEFT RO' },
    { id: 16, name: 'LEFT SUBWAY' },
    { id: 17, name: 'CENTER SUBWAY' },
    { id: 18, name: 'CNTR SHOT RU' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: '<P>AID' },
    { id: 26, name: 'P<A>ID' },
    { id: 27, name: 'PA<I>D' },
    { id: 28, name: 'PAI<D>' },

    { id: 33, name: 'BOTTOM JET' },
    { id: 34, name: 'RIGHT POPPER' },
    { id: 35, name: 'R RAMP ENTER' },
    { id: 36, name: 'L RAMP ENTER' },
    { id: 37, name: 'LOW R POPPER' },
    { id: 38, name: 'RAMP UP DWN' },

    { id: 41, name: 'COLA' },
    { id: 42, name: 'HOTDOG' },
    { id: 43, name: 'POPCORN' },
    { id: 44, name: 'ICE CREAM' },
    { id: 45, name: 'LEFT JET' },
    { id: 46, name: 'RIGHT JET' },
    { id: 47, name: 'LEFT SLING' },
    { id: 48, name: 'RIGHT SLING' },

    { id: 51, name: 'LEFT OUTLANE' },
    { id: 52, name: 'LEFT RET LANE' },
    { id: 53, name: 'RIGHT RET LANE' },
    { id: 54, name: 'RIGHT OUTLANE' },
    { id: 55, name: 'OUTHOLE' },
    { id: 56, name: 'RGHT TROUGH' },
    { id: 57, name: 'CNTR TROUGH' },
    { id: 58, name: 'LFT TROUGH' },

    { id: 61, name: 'R RAMP EXIT' },
    { id: 62, name: 'LOW L RAMP EXIT' },
    { id: 63, name: 'CNTR LANE EXIT' },
    { id: 64, name: 'UPPER RAMP EXIT' },
    { id: 65, name: 'BOWL' },
    { id: 66, name: 'SHOOTER' },
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
    image: 'playfield-cftbl.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  cabinetColors: [
    '#7FF24B',
    '#6E34F4',
    '#F0F158',
    '#D83826',
  ],
  initialise: {
    closedSwitches: [
      56, 57, 58,
      22,
      'F2', 'F4',
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

      { offset: 0x48B, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x16A1, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x16A8, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x16AF, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x16B6, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

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

      { offset: 0x1CA9, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1CAC, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CB1, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1CB4, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CB9, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1CBC, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CC1, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1CC4, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CCB, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1CCE, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  },
  testErrors: [
    'CLOCK IS BROKEN',
  ]
};
