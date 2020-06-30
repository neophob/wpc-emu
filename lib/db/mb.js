'use strict';

module.exports = {
  name: 'WPC-95: Monster Bash',
  version: '1.06b',
  pinmame: {
    knownNames: [ 'mb_05', 'mb_10', 'mb_106', 'mb_106b' ],
    gameName: 'Monster Bash',
    id: 'mb',
  },
  rom: {
    u06: 'mb_106b.bin',
  },
  switchMapping: [
    { id: 11, name: 'LAUNCH BUTTON' },
    { id: 12, name: 'DRAC STANDUP TOP' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'DRAC STANDUP BOT' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT RETURN' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TOMB TREASURE' },
    { id: 25, name: 'DRACULA TARGET' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'LEFT EJECT' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'RIGHT POPPER' },

    { id: 42, name: 'L FLIP OPTO' },
    { id: 43, name: 'R FLIP OPTO' },
    { id: 44, name: 'L BLUE TGT' },
    { id: 45, name: 'C BLUE TGT' },
    { id: 46, name: 'R BLUE TGT' },
    { id: 47, name: 'L FLIP PROX' },
    { id: 48, name: 'R FLIP PROX' },

    { id: 51, name: 'LEFT SLINGSHOT' },
    { id: 52, name: 'RIGHT SLINGSHOT' },
    { id: 53, name: 'LEFT JET' },
    { id: 54, name: 'RIGHT JET' },
    { id: 55, name: 'BOTTOM JET' },
    { id: 56, name: 'LEFT TOP LANE' },
    { id: 57, name: 'MIDDLE TOP LANE' },
    { id: 58, name: 'RIGHT TOP LANE' },

    { id: 61, name: 'LEFT LOOP LO' },
    { id: 62, name: 'LEFT LOOP HI' },
    { id: 63, name: 'RIGHT LOOP LO' },
    { id: 64, name: 'RIGHT LOOP HI' },
    { id: 65, name: 'CENTER LOOP' },
    { id: 66, name: 'L RAMP ENTER' },
    { id: 67, name: 'L RAMP EXIT' },
    { id: 68, name: 'C RAMP ENTER' },

    { id: 71, name: 'R RAMP ENTER' },
    { id: 72, name: 'R RAMP EXIT' },
    { id: 73, name: 'R RAMP LOCK' },
    { id: 74, name: 'DRAC POSITION 5' },
    { id: 75, name: 'DRAC POSITION 4' },
    { id: 76, name: 'DRAC POSITION 3' },
    { id: 77, name: 'DRAC POSITION 2' },
    { id: 78, name: 'DRAC POSITION 1' },

    { id: 81, name: 'UP/DN BANK UP' },
    { id: 82, name: 'UP/DN BANK DOWN' },
    { id: 83, name: 'FRANK TABLE DOWN' },
    { id: 84, name: 'FRANK TABLE UP' },
    { id: 85, name: 'L UP/DN BANK TGT' },
    { id: 86, name: 'R UP/DN BANK TGT' },
    { id: 87, name: 'FRANK HIT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'CENTER SPINNER' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-mb.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#0F238D',
    '#54B85D',
    '#EBE460',
    '#CB348C',
    '#4FB4E0',
    '#C4382C',
  ],
  initialise: {
    closedSwitches: [
      22, 81,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 74, 75, 76, 77, 78
      31, 36, 42, 43, 74, 75, 76, 77, 78,
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
      { offset: 0x86, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x458, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },
      { offset: 0x583, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

      { offset: 0x16A0, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x16A6, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x16AC, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x16B2, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

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

      { offset: 0x1C93, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1C96, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C9B, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1C9E, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CA3, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1CA6, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CAB, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1CAE, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CB5, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1CB8, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
