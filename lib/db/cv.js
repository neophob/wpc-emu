'use strict';

module.exports = {
  name: 'WPC-95: Cirqus Voltaire',
  version: '1.3',
  pinmame: {
    knownNames: [ 'cv_10', 'cv_11', 'cv_13', 'cv_14', 'cirq_14', 'cv_20h', 'cv_20hc' ],
    gameName: 'Cirqus Voltaire',
    id: 'cv',
  },
  rom: {
    u06: 'CV_G11.1_3',
  },
  switchMapping: [
    { id: 11, name: 'BACK BOX LUCK' },
    { id: 12, name: 'WIRE RAM ENTER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT LOOP UPPER' },
    { id: 16, name: 'TOP EDDY' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'RIGHT LOOP UPPER' },
    { id: 25, name: 'INNER LOOP LEFT' },
    { id: 26, name: 'LEFT INLANE' },
    { id: 27, name: 'LEFT OUTLANE' },
    { id: 28, name: 'INNER LOOP RIGHT' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'POPPER OPTO' },
    { id: 37, name: 'WOW TARGET' },
    { id: 38, name: 'TOP TARGETS' },

    { id: 41, name: 'LEFT LANE' },
    { id: 42, name: 'RINGMASTER UP' },
    { id: 43, name: 'RINGMASTER MID' },
    { id: 44, name: 'RINGMASTER DOWN' },
    { id: 45, name: 'LEFT RAMP MADE' },
    { id: 46, name: 'TROUGH UPPER' },
    { id: 47, name: 'TROUGH MIDDLE' },
    { id: 48, name: 'LEFT LOOP ENTER' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'UPPER JET' },
    { id: 54, name: 'MIDDLE JET' },
    { id: 55, name: 'LOWER JET' },
    { id: 56, name: 'SKILL SHOT' },
    { id: 57, name: 'RIGHT OUTLANE' },
    { id: 58, name: 'RING N,G' },

    { id: 61, name: 'LIGHT STANDUP' },
    { id: 62, name: 'LOCK STANDUP' },
    { id: 63, name: 'RAMP ENTER' },
    { id: 64, name: 'RAMP MAGNET' },
    { id: 65, name: 'RAMP MADE' },
    { id: 66, name: 'RAMP LOCK LOW' },
    { id: 67, name: 'RAMP LOCK MID' },
    { id: 68, name: 'RAMP LOCK HIGH' },

    { id: 71, name: 'LEFT SAUCER' },
    { id: 72, name: 'RIGHT SAUCER' },
    { id: 74, name: 'BIG BALL REBOUND' },
    { id: 75, name: 'VOLT RIGHT' },
    { id: 76, name: 'VOLT LEFT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'RIGHT SPINNER' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'LEFT SPINNER' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-cv.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#A1C14B',
    '#67AA44',
    '#D6623C',
    '#9FD8E4',
    '#B7807C',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36,
      31,
      'F2', 'F4', 'F6', 'F8',
    ],
    initialAction: [
      {
        delayMs: 1500,
        source: 'cabinetInput',
        value: 16
      },
      {
        delayMs: 10000,
        source: 'switchInput',
        value: 22
      },
      {
        delayMs: 2000,
        source: 'switchInput',
        value: 22
      },
    ],
  },
  testErrors: [
    'CHECK SWITCH 16 TOP EDDY',
    'CHECK SWITCH 42 RINGMASTER UP',
    'CHECK SWITCH 43 RINGMASTER MID',
    'CHECK SWITCH 44 RINGMASTER DOWN',
    'RINGMASTER ERROR NO MOTION',
  ],
  memoryPosition: {
    knownValues: [
      { offset: 0x80, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x45B, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },
      { offset: 0x595, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

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

      { offset: 0x1D83, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D86, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D8B, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D8E, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D93, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D96, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D9B, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D9E, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x174E, name: 'HISCORE_CHAMP_NAME', description: 'Cannon Ball Champion', type: 'string' },
      { offset: 0x1751, name: 'HISCORE_CHAMP_SCORE', description: 'Cannon Ball Champion', type: 'bcd', length: 5 },
      { offset: 0x1DA5, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1DA8, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },

    ],
  },
};
