'use strict';

module.exports = {
  name: 'WPC-95: Tales of the Arabian Nights',
  version: '1.4',
  pinmame: {
    knownNames: [ 'totan_04', 'totan_12', 'totan_13', 'totan_14', 'totan_15c' ],
    gameName: 'Tales of the Arabian Nights',
    id: 'totan',
  },
  rom: {
    u06: 'an_g11.1_4',
  },
  switchMapping: [
    { id: 11, name: 'HAREM PASSAGE' },
    { id: 12, name: 'VANISH TUNNEL' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RAMP ENTER' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'BALL SHOOTER' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'GENIE STANDUP' },
    { id: 25, name: 'BAZAAR EJECT' },
    { id: 26, name: 'LEFT INLANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'LEFT WIRE MAKE' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LEFT CAGE OPTO' },
    { id: 37, name: 'RIGHT CAGE OPTO' },
    { id: 38, name: 'LEFT EJECT' },

    { id: 41, name: 'RAMP MADE LEFT' },
    { id: 42, name: 'GENIE TARGET' },
    { id: 43, name: 'LEFT LOOP' },
    { id: 44, name: 'INNER LOOP LEFT' },
    { id: 45, name: 'INNER LOOP RGT' },
    { id: 46, name: 'MINI STANDUPS' },
    { id: 47, name: 'RAMP MADE RGT' },
    { id: 48, name: 'RGT CAPTIVE BALL' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'LEFT JET' },
    { id: 54, name: 'RIGHT JET' },
    { id: 55, name: 'MIDDLE JET' },
    { id: 56, name: 'LAMP SPIN CCW' },
    { id: 57, name: 'LAMP SPIN CW' },
    { id: 58, name: 'LFT CAPTIVE BALL' },

    { id: 61, name: 'LEFT STANDUPS' },
    { id: 62, name: 'RIGHT STANDUPS' },
    { id: 63, name: 'TOP SKILL' },
    { id: 64, name: 'MIDDLE SKILL' },
    { id: 65, name: 'BOTTOM SKILL' },
    { id: 66, name: 'LOCK 1 (BOT)' },
    { id: 67, name: 'LOCK 2' },
    { id: 68, name: 'LOCK 3 (TOP)' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
    { id: 'F8', name: 'UL FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-totan.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#E9B840',
    '#285E8F',
    '#DB3125',
    '#BC9248',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37,
      31, 36, 37,
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      },
      {
        description: 'enable free play',
        delayMs: 3000,
        source: 'writeMemory',
        offset: 0x1C76,
        value: 0x01,
      },
    ],
  },
  memoryPosition: {
    checksum: [
    ],
    knownValues: [
      { offset: 0x7A, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x43E, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },
      { offset: 0x58E, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

      { offset: 0x16A0, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x16A7, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x16AE, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x16B5, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

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

      { offset: 0x1BF8, name: 'GAME_BALL_TOTAL', description: 'Balls per game', type: 'uint8' },
      { offset: 0x1C76, name: 'STAT_FREEPLAY', description: '0: not free, 1: free', type: 'uint8' },

      { offset: 0x1D5F, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D62, name: 'HISCORE_1_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1D68, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D6B, name: 'HISCORE_2_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1D71, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D74, name: 'HISCORE_3_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1D7A, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D7D, name: 'HISCORE_4_SCORE', type: 'bcd', length: 6 },

      { offset: 0x1D85, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D88, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 6 },

    ]
  }
};
