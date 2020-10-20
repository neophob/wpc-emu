'use strict';

module.exports = {
  name: 'WPC-S: Red & Ted\'s Road Show',
  version: 'LX-5',
  pinmame: {
    knownNames: [ 'rs_l6', 'rs_lx2p3', 'rs_lx2', 'rs_dx2', 'rs_lx3', 'rs_dx3', 'rs_la4', 'rs_da4', 'rs_lx4', 'rs_dx4', 'rs_la5', 'rs_da5', 'rs_lx5', 'rs_dx5' ],
    gameName: 'Red & Ted\'s Road Show',
    id: 'rs',
  },
  rom: {
    u06: 'u6_lx5.rom',
  },
  switchMapping: [
    { id: 11, name: '"TED"S MOUTH' },
    { id: 12, name: 'DOZER DOWN' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'DOZER UP' },
    { id: 16, name: 'RIGHT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE 2' },
    { id: 18, name: 'RIGHT INLANE 1' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: '"RED"S MOUTH' },
    { id: 26, name: 'LEFT OUTLANE' },
    { id: 27, name: 'LEFT INLANE' },
    { id: 28, name: 'B ZONE 3 BANK' },

    { id: 31, name: 'SKILL SHOT LOWER' },
    { id: 32, name: 'SKILL SHOT UPPER' },
    { id: 33, name: 'RIGHT SHOOTER' },
    { id: 34, name: 'RADIO 3 BANK' },
    { id: 35, name: '"RED" STANDUP U' },
    { id: 36, name: '"RED" STAND L' },
    { id: 37, name: 'HIT "RED"' },
    { id: 38, name: 'RIGHT LOOP EXIT' },

    { id: 41, name: 'TROUGH JAM' },
    { id: 42, name: 'TROUGH 1' },
    { id: 43, name: 'TROUGH 2' },
    { id: 44, name: 'TROUGH 3' },
    { id: 45, name: 'TROUGH 4' },
    { id: 46, name: 'RIGHT LOOP ENTER' },
    { id: 47, name: 'HIT BULLDOZER' },
    { id: 48, name: 'HIT "TED"' },

    { id: 51, name: 'SPINNER' },
    { id: 52, name: 'LOCKUP 1' },
    { id: 53, name: 'LOCKUP 2' },
    { id: 54, name: 'LOCK KICKOUT' },
    { id: 55, name: 'R RAMP EXIT LEFT' },
    { id: 56, name: 'LEFT RAMP EXIT' },
    { id: 57, name: 'LEFT RAMP ENTER' },
    { id: 58, name: 'LEFT SHOOTER' },

    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGHT SLING' },
    { id: 63, name: 'LEFT JET' },
    { id: 64, name: 'TOP JET' },
    { id: 65, name: 'RIGHT JET' },

    { id: 71, name: 'RIGHT RAMP ENTER' },
    { id: 72, name: 'R RAMP EXIT CEN' },
    { id: 73, name: 'F ROCKS 5X BLAST' },
    { id: 74, name: 'F ROCKS RAD RIOT' },
    { id: 75, name: 'F ROCKS EX BALL' },
    { id: 76, name: 'F ROCKS TOP' },
    { id: 77, name: 'UNDER BLAST ZONE' },
    { id: 78, name: 'START CITY' },

    { id: 81, name: 'WHITE STANDUP' },
    { id: 82, name: 'RED STANDUP' },
    { id: 83, name: 'YELLOW STANDUP' },
    { id: 84, name: 'ORANGE STANDUP' },
    { id: 85, name: 'MID L FLIP TOP' },
    { id: 86, name: 'MID L FLIP BOT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UL FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
    { id: 'F7', name: 'ML FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-rtrs.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#4182C2',
    '#DD713E',
    '#E2D355',
    '#E53925',
    '#6EEA74',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 41, 42, 43, 44, 45,
      41,
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

      { offset: 0x43D, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

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

      { offset: 0x1C61, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1C64, name: 'HISCORE_1_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C69, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1C6D, name: 'HISCORE_2_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C71, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1C76, name: 'HISCORE_3_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C79, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1C7F, name: 'HISCORE_4_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C87, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1C8B, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
