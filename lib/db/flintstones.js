'use strict';

module.exports = {
  name: 'WPC-S: The Flintstones',
  version: 'LX-5',
  pinmame: {
    knownNames: [ 'fs_lx2', 'fs_dx2', 'fs_sp2', 'fs_sp2d', 'fs_lx4', 'fs_dx4', 'fs_lx5', 'fs_dx5' ],
    gameName: 'Flintstones, The',
    id: 'fs',
  },
  rom: {
    u06: 'flin_lx5.rom',
  },
  switchMapping: [
    { id: 11, name: 'LAUNCH BUTTON' },
    { id: 12, name: 'TICKET DISP' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RT. SHOOTER LANE' },
    { id: 16, name: 'LFT. BOWLING TGT' },
    { id: 17, name: 'CNT. BOWLING TGT' },
    { id: 18, name: 'RGT. BOWLING TGT' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY IN' },
    { id: 25, name: 'MACHINE EXIT' },
    { id: 26, name: 'UP LFT HALF TGT' },
    { id: 27, name: 'LEFT LANE EXIT' },
    { id: 28, name: 'LFT LOOP ENTER' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 36, name: 'TOP POPPER' },
    { id: 37, name: 'RGHT RMP ENTER' },
    { id: 38, name: 'LFT RMP ENTER' },

    { id: 41, name: 'BED<R>OCK' },
    { id: 42, name: 'BEDR<O>CK' },
    { id: 43, name: 'BEDRO<C>K' },
    { id: 44, name: 'BEDROC<K>' },
    { id: 45, name: 'BE<D>ROCK' },
    { id: 46, name: 'B<E>DROCK' },
    { id: 47, name: '<B>EDROCK' },
    { id: 48, name: 'CENTER LANE EXIT' },

    { id: 51, name: 'LFT RGHT TGT 3' },
    { id: 52, name: 'LFT RGHT TGT 2' },
    { id: 53, name: 'LFT RGHT TGT 1' },
    { id: 54, name: 'LEFT HALF TGT' },
    { id: 55, name: 'RIGHT HALF TGT' },
    { id: 56, name: 'DICTABIRD TARGET' },

    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGHT SLING' },
    { id: 63, name: 'LEFT BUMPER' },
    { id: 64, name: 'RIGHT BUMPER' },
    { id: 65, name: 'BOTM BUMPER' },
    { id: 66, name: '<D>IG' },
    { id: 67, name: 'D<I>G' },
    { id: 68, name: 'DI<G>' },

    { id: 71, name: 'LEFT OUTLANE' },
    { id: 72, name: 'LFT RET LANE' },
    { id: 73, name: 'RGT RET LANE' },
    { id: 74, name: 'RIGHT OUTLANE' },
    { id: 75, name: 'RIGHT LANE EXIT' },
    { id: 76, name: 'MACHINE ENTER' },
    { id: 77, name: 'RIGHT RAMP EXIT' },
    { id: 78, name: 'LEFT RAMP EXIT' },
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
    image: 'playfield-flintstones.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#F2A73C',
    '#FBE14C',
    '#4BAAD6',
    '#D83282',
    '#A1A73A',
    '#A8572E',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 41, 42, 43
      31, 41, 42, 43,
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
      { offset: 0x80, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x43A, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

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

      { offset: 0x1C61, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1C64, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C69, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1C6C, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C71, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1C74, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C79, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1C7C, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C83, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1C86, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
