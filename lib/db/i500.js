'use strict';

module.exports = {
  name: 'WPC-S: Indianapolis 500',
  version: '1.1R',
  pinmame: {
    knownNames: [ 'i500_11r', 'i500_11b', 'i500_10r' ],
    gameName: 'Indianapolis 500',
    id: 'i500',
  },
  rom: {
    u06: 'indy1_1r.rom',
  },
  switchMapping: [
    { id: 11, name: 'BALL LAUNCH' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT OUTLANE' },
    { id: 16, name: 'LEFT FLIP LANE' },
    { id: 17, name: 'RIGHT FLIP LANE' },
    { id: 18, name: 'RIGHT OUTLANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: 'SHOOTER LANE' },
    { id: 26, name: 'LEFT SLINGSHOT' },
    { id: 27, name: 'RIGHT SLINGSHOT' },
    { id: 28, name: 'THREE BANK UPPER' },

    { id: 31, name: 'HREE BANK CENTER' },
    { id: 32, name: 'THREE BANK LOWER' },
    { id: 34, name: 'RT FLIP WRENCH' },
    { id: 35, name: 'LEFT RAMP ENTER' },
    { id: 36, name: 'LEFT RAMP MADE' },
    { id: 37, name: 'LEFT LOOP' },
    { id: 38, name: 'RIGHT LOOP' },

    { id: 41, name: 'TOP TROUGH' },
    { id: 42, name: 'TROUGH 1 (RT)' },
    { id: 43, name: 'TROUGH 2' },
    { id: 44, name: 'TROUGH 3' },
    { id: 45, name: 'TROUGH 4 (LFT)' },
    { id: 46, name: 'LFT RAMP STANDUP' },
    { id: 47, name: 'TURBO WRENCH' },
    { id: 48, name: 'JET BUMPER WRENCH' },

    { id: 51, name: 'LEFT LANE' },
    { id: 52, name: 'CENTER LANE' },
    { id: 53, name: 'RIGHT LANE' },
    { id: 54, name: 'TEN POINT' },
    { id: 55, name: 'LEFT RAMP WRENCH' },
    { id: 56, name: 'LEFT LIGHT-UP' },
    { id: 57, name: 'CENTER LIGHT-UP' },
    { id: 58, name: 'RIGHT LIGHT-UP' },

    { id: 61, name: 'UPPER POPPER' },
    { id: 62, name: 'TURBO POPPER' },
    { id: 63, name: 'TURBO BALL SENSE' },
    { id: 64, name: 'UPPER EJECT' },
    { id: 65, name: 'LOWER KICKER' },
    { id: 66, name: 'TURBO INDEX' },

    { id: 72, name: 'LEFT JET' },
    { id: 73, name: 'RIGHT JET' },
    { id: 74, name: 'CENTER JET' },
    { id: 75, name: 'RIGHT RAMP ENTER' },
    { id: 76, name: 'RIGHT RAMP MADE' },
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
    image: 'playfield-i500.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#E83A24',
    '#F4BE43',
    '#2E73B9',
    '#4CA65F',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 41, 42, 43, 44, 45, 56, 57, 58, 61, 62, 63
      41, 56, 57, 58, 61, 62, 63,
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

      { offset: 0x1D25, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D28, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D2D, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D30, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D35, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D38, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D3D, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D40, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D85, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D89, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
