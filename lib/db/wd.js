'use strict';

module.exports = {
  name: 'WPC-S: WHO Dunnit',
  version: '1.2',
  pinmame: {
    knownNames: [ 'wd_03r', 'wd_048r', 'wd_10r', 'wd_10g', 'wd_10f', 'wd_11', 'wd_12', 'wd_12g' ],
    gameName: 'WHO Dunnit',
    id: 'wd',
  },
  rom: {
    u06: 'whod1_2.rom',
  },
  switchMapping: [
    { id: 11, name: '3 BANK POS 2' },
    { id: 12, name: 'SLOT INDEX LEFT' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOOTER LANE' },
    { id: 16, name: 'RIGHT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'RIGHT LOOP' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY IN BUTTON' },
    { id: 25, name: 'SLOT INDEX CNTR' },
    { id: 26, name: 'LEFT INLANE' },
    { id: 27, name: 'LEFT OUTLANE' },
    { id: 28, name: 'LEFT LOOP' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 36, name: 'ENTER RAMP' },
    { id: 37, name: 'MADE RAMP LEFT' },

    { id: 41, name: 'TOP LEFT HOLE' },
    { id: 42, name: 'POST JETS' },
    { id: 43, name: 'BCK RIGHT POPPER' },
    { id: 44, name: 'LOW RIGHT POPPER' },
    { id: 47, name: 'EXTRA RIGHT HOLE' },
    { id: 48, name: 'SLOT INDEX RIGHT' },

    { id: 51, name: 'LOCK UP 1' },
    { id: 52, name: 'TOP 4 BANK' },
    { id: 53, name: '2ND 4 BANK' },
    { id: 54, name: '3RD 4 BANK' },
    { id: 55, name: 'BOT 4 BANK' },
    { id: 56, name: 'MYSTERY TARGET' },
    { id: 57, name: 'LOW RT LOCK 2' },
    { id: 58, name: 'RED' },

    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGHT SLING' },
    { id: 63, name: 'LEFT JET' },
    { id: 64, name: 'BOTTOM JET' },
    { id: 65, name: 'RIGHT JET' },
    { id: 66, name: 'LEFT 3 BANK' },
    { id: 67, name: 'CENTER 3 BANK' },
    { id: 68, name: 'RIGHT 3 BANK' },

    { id: 71, name: 'TOP 2 BANK' },
    { id: 72, name: 'BOT 2 BANK' },
    { id: 73, name: '3 BANKS POS UP' },
    { id: 74, name: 'UP DN RAMP' },
    { id: 75, name: 'SCOOP CENTER' },
    { id: 76, name: 'SCOOP RIGHT' },
    { id: 77, name: 'SCOOP LEFT' },
    { id: 78, name: 'BLACK' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'SPINNER' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-wd.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#ECCA47',
    '#CC3725',
    '#452965',
    '#7CCFDF',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 47, 48, 51, 52, 53
      31, 36, 37, 41, 42, 43, 44, 47, 48, 51, 52, 53,
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

      { offset: 0x43E, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },
      { offset: 0x5B6, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

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

      { offset: 0x1CD9, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1CDD, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CE2, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1CE6, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CEB, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1CEF, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CEB, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1CF7, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CFF, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D03, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
