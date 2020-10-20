'use strict';

module.exports = {
  name: 'WPC-95: The Champion Pub',
  version: '1.6',
  pinmame: {
    knownNames: [ 'cp_15', 'cp_16' ],
    gameName: 'Champion Pub, The',
    id: 'cp',
  },
  rom: {
    u06: 'CP_G11.1_6',
  },
  switchMapping: [
    { id: 11, name: 'MADE RAMP' },
    { id: 12, name: 'HEAVY BAG' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LOCK UP 1' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT RETURN' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BALL LAUNCH' },
    { id: 25, name: 'THREE BANK MID' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'POPPER' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LEFT JAB MADE' },
    { id: 37, name: 'CORNER EJECT' },
    { id: 38, name: 'RIGHT JAB MADE' },

    { id: 41, name: 'BOXER POLE CNTR' },
    { id: 42, name: 'BEHND LEFT SCOOP' },
    { id: 43, name: 'BEHND RGHT SCOOP' },
    { id: 44, name: 'ENTER RAMP' },
    { id: 45, name: 'JUMP ROPE' },
    { id: 46, name: 'BAG POLE CENTER' },
    { id: 47, name: 'BOXER POLE RIGHT' },
    { id: 48, name: 'BOXER POLE LEFT' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'THREE BANK BOTTO' },
    { id: 54, name: 'THREE BANK TOP' },
    { id: 55, name: 'LEFT HALF GUY' },
    { id: 56, name: 'RGHT HALD GUY' },
    { id: 57, name: 'LOCK UP 2' },
    { id: 58, name: 'LOCK UP 3' },

    { id: 61, name: 'LEFT SCOOP UP' },
    { id: 62, name: 'RIGHT SCOOP UP' },
    { id: 63, name: 'POWER SHOT' },
    { id: 64, name: 'ROPE CAM' },
    { id: 65, name: 'SPEED BAG' },
    { id: 66, name: 'BOXER GUT 1' },
    { id: 67, name: 'BOXER GUT 2' },
    { id: 68, name: 'BOXER HEAD' },

    { id: 71, name: 'EXIT ROPE' },
    { id: 72, name: 'ENTER SPEED BAG' },
    { id: 73, name: 'REMOVED' },
    { id: 74, name: 'ENTER LOCKUP' },
    { id: 75, name: 'SWITCH 75' },
    { id: 76, name: 'TOP OF RAMP' },
    { id: 77, name: 'SWITCH 77' },
    { id: 78, name: 'ENTER ROPE' },
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
    image: 'playfield-tcp.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#E76031',
    '#ECCA9E',
    '#497A9B',
    '#CC2D1E',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 38, 41, 42, 43, 44, 45, 46, 47, 48, 64
      31, 36, 38, 41, 42, 43, 44, 45, 46, 47, 48, 64,
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

      { offset: 0x440, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },
      { offset: 0x56F, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

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

      { offset: 0x1D15, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D19, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D1E, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D22, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D27, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D2B, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D30, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D34, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D3B, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D3F, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  },
  testErrors: [
    'R. FLIPPER E.O.S. IS STUCK CLOSED',
    'L. FLIPPER E.O.S. IS STUCK CLOSED',
  ]
};
