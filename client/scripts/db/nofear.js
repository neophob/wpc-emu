'use strict';

module.exports = {
  name: 'WPC-S: No Fear',
  version: '2.3X',
  rom: {
    u06: 'nofe2_3x.rom',
  },
  switchMapping: [
    { id: 11, name: 'BALL LAUNCH' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOOTER LANE' },
    { id: 16, name: 'SPINNER' },
    { id: 17, name: 'RIGHT OUTLANE' },
    { id: 18, name: 'RIGHT RETURN' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY EXTRA BALL' },
    { id: 25, name: 'KICKBACK' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'LEFT SLINGSHOT' },
    { id: 28, name: 'RIGHT SLINGSHOT' },

    { id: 31, name: 'TROUGH STACK' },
    { id: 32, name: 'TROUGH 1 (RIGHT)' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 37, name: 'CENTER TR ENTR' },
    { id: 38, name: 'LEFT TR ENTER' },

    { id: 41, name: 'RIGHT POPPER 1' },
    { id: 42, name: 'RIGHT POPPER 2' },
    { id: 46, name: 'LEFT MAGNET' },
    { id: 47, name: 'CENTER MAGNET' },
    { id: 48, name: 'RIGHT MAGNET' },

    { id: 51, name: 'DROP TARGET' },
    { id: 54, name: 'LEFT WIREFORM' },
    { id: 55, name: 'INNER LOOP' },
    { id: 56, name: 'LIGHT KB BOTTOM' },
    { id: 57, name: 'LIGHT KB TOP' },
    { id: 58, name: 'RIGHT LOOP' },

    { id: 61, name: 'EJECT HOLE' },
    { id: 62, name: 'LEFT LOOP' },
    { id: 63, name: 'LEFT RAMP ENTER' },
    { id: 64, name: 'LEFT RMP MIDDLE' },
    { id: 66, name: 'RIGHT RMP ENTER' },
    { id: 67, name: 'RIGHT RAMP EXIT' },

    { id: 71, name: 'RIGHT BANK TOP' },
    { id: 72, name: 'RIGHT BANK MID' },
    { id: 73, name: 'RIGHT BANK BOT' },
    { id: 74, name: 'L TROLL UP' },
    { id: 75, name: 'R TROLL UP' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-nf.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES 31, 32, 33, 34, 35, 37, 38, 41, 42, 46, 47, 48,
      31, 37, 38, 41, 42, 46, 47, 48,
      'F2', 'F4', 'F6', 'F8',
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
        offset: 0x1C16,
        value: 0x01,
      },
    ],
  },
  memoryPosition: {
    checksum: [
      { dataStartOffset: 0x1CED, dataEndOffset: 0x1D10, checksumOffset: 0x1D11, checksum: '16bit', name: 'HI_SCORE' },
      { dataStartOffset: 0x1D13, dataEndOffset: 0x1D1B, checksumOffset: 0x1D1C, checksum: '16bit', name: 'CHAMPION' }
    ],
    knownValues: [
      { offset: 0x7A, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x3B2, name: 'GAME_PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x3B3, name: 'GAME_BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

      { offset: 0x43E, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x16A1, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x16A8, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x16AF, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x16B6, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

      { offset: 0x1709, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

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

      { offset: 0x1913, name: 'STAT_LEFT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x1919, name: 'STAT_RIGHT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x19FD, name: 'STAT_LEFT_FLIPPER_TRIG', type: 'uint8', length: 3 },
      { offset: 0x1A03, name: 'STAT_RIGHT_FLIPPER_TRIG', type: 'uint8', length: 3 },

      { offset: 0x1B98, name: 'GAME_BALL_TOTAL', description: 'Balls per game', type: 'uint8' },
      { offset: 0x1C16, name: 'STAT_FREEPLAY', description: '0: not free, 1: free', type: 'uint8' },

      { offset: 0x1CED, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1CF1, name: 'HISCORE_1_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1CF6, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1CFA, name: 'HISCORE_2_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1CFF, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D03, name: 'HISCORE_3_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1D08, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D0C, name: 'HISCORE_4_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1D13, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D17, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },

      { offset: 0x1D24, name: 'GAME_CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1D25, name: 'GAME_CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
    ]
  },
};
