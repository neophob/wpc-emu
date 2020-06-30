'use strict';

module.exports = {
  name: 'WPC-95: NBA Fastbreak',
  version: '3.1',
  pinmame: {
    knownNames: [ 'nbaf_11s', 'nbaf_11', 'nbaf_11a', 'nbaf_115', 'nbaf_21', 'nbaf_22', 'nbaf_23', 'nbaf_31', 'nbaf_31a' ],
    gameName: 'NBA Fastbreak',
    id: 'nbaf',
  },
  rom: {
    u06: 'fb_g11.3_1',
  },
  switchMapping: [
    { id: 11, name: 'BALL LAUNCHER' },
    { id: 12, name: 'BACKBOX BASKET' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOOTER LANE' },
    { id: 16, name: 'LT RETURN LANE' },
    { id: 17, name: 'RT RETURN LANE' },
    { id: 18, name: 'L R STANDUP' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'RIGHT JET' },
    { id: 25, name: 'EJECT HOLE' },
    { id: 26, name: 'LEFT OUT LANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'U R STANDUP' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'CENTER RAMP OPTO' },
    { id: 37, name: 'R LOOP ENT OPTO' },
    { id: 38, name: 'RIGHT LOOP EXIT' },

    { id: 41, name: 'STANDUP "3"' },
    { id: 42, name: 'STANDUP "P"' },
    { id: 43, name: 'STANDUP "T"' },
    { id: 44, name: 'RIGHT RAMP ENTER' },
    { id: 45, name: 'LEFT RAMP ENTER' },
    { id: 46, name: 'LEFT RAMP MADE' },
    { id: 47, name: 'LEFT LOOP ENTER' },
    { id: 48, name: 'LEFT LOOP MADE' },

    { id: 51, name: 'DEFENDER POS 4' },
    { id: 52, name: 'DEFENDER POS 3' },
    { id: 53, name: 'DEFEND LOCK POS' },
    { id: 54, name: 'DEFENDER POS 2' },
    { id: 55, name: 'DEFENDER POS 1' },
    { id: 56, name: 'JETS BALL DRAIN' },
    { id: 57, name: 'L SLINGSHOT' },
    { id: 58, name: 'R SLINGSHOT' },

    { id: 61, name: 'LEFT JET' },
    { id: 62, name: 'MIDDLE JET' },
    { id: 63, name: 'L LOOP RAMP EXIT' },
    { id: 64, name: 'RIGHT RAMP MADE' },
    { id: 65, name: '"IN THE PAINT" 4' },
    { id: 66, name: '"IN THE PAINT" 3' },
    { id: 67, name: '"IN THE PAINT" 2' },
    { id: 68, name: '"IN THE PAINT" 1' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'BASKED MADE' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'BASKED HOLD' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-nba.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#2B1772',
    '#E73F27',
    '#F8DD4C',
    '#67DCEE',
    '#AB6341',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 51, 52, 53, 54, 55
      31, 36, 37, 51, 52, 53, 54, 55,
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

      { offset: 0x43D, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

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

      { offset: 0x1C87, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1C8A, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
