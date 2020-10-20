'use strict';

module.exports = {
  name: 'WPC-S: Dirty Harry',
  version: 'LX-2',
  pinmame: {
    knownNames: [ 'dh_lx2', 'dh_dx2', 'dh_lf2' ],
    gameName: 'Dirty Harry',
    id: 'dh',
  },
  rom: {
    u06: 'harr_lx2.rom',
  },
  switchMapping: [
    { id: 11, name: 'GUN HANDLE TRIGGER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOOTER LANE' },
    { id: 16, name: 'RIGHT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'STANDUP 8' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'EX BALL BUTTON' },
    { id: 25, name: 'LEFT INLANE' },
    { id: 26, name: 'LEFT OUTLANE' },
    { id: 27, name: 'STANDUP 1' },
    { id: 28, name: 'STANDUP 2' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 38, name: 'RIGHT RAMP MAKE' },

    { id: 41, name: 'LEFT RAMP ENTER' },
    { id: 42, name: 'RIGHT LOOP' },
    { id: 43, name: 'LEFT RAMP MAKE' },
    { id: 44, name: 'GUN CHAMBER' },
    { id: 45, name: 'GUN POPPER' },
    { id: 46, name: 'TOP R POPPER' },
    { id: 47, name: 'LEFT POPPER' },

    { id: 51, name: 'RIGHT RAMP ENTER' },
    { id: 53, name: 'DROP TARGET DOWN' },
    { id: 54, name: 'STANDUP 6' },
    { id: 55, name: 'STANDUP 7' },
    { id: 56, name: 'STANDUP 5' },
    { id: 57, name: 'STANDUP 4' },
    { id: 58, name: 'STANDUP 3' },

    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGHT SLING' },
    { id: 63, name: 'LEFT JET' },
    { id: 64, name: 'MIDDLE JET' },
    { id: 65, name: 'RIGHT JET' },
    { id: 66, name: 'LEFT ROLLOVER' },
    { id: 67, name: 'MIDDLE ROLLOVER' },
    { id: 68, name: 'RIGHT ROLLOVER' },

    { id: 71, name: 'LEFT LOOP' },
    { id: 73, name: 'TOP L POPPER' },
    { id: 76, name: 'GUN POSITION' },
    { id: 77, name: 'GUN LOOKUP' },

    { id: 88, name: 'TEST SWITCH' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-dh.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#4363AF',
    '#C1616C',
    '#CF8765',
    '#CC984E',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 38, 41, 42, 43, 44, 45, 46, 47,
      31, 38, 41, 42, 43, 44, 45, 46, 47,
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

      { offset: 0x1CE3, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1CE7, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CEC, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1CF0, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D09, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D0D, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
