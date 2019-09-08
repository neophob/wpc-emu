'use strict';

module.exports = {
  name: 'WPC-95: Congo',
  version: '2.1',
  rom: {
    u06: 'cg_g11.2_1',
  },
  switchMapping: [
    { id: 11, name: 'INNER LEFT LOOP' },
    { id: 12, name: 'UPPER LOOP' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'JET EXIT' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT RETURN LANE' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 25, name: 'RIGHT EJECT RUBBER' },
    { id: 26, name: 'LEFT RETURN INLANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: '"YOU" STANDUP TARGET"' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'VOLCANO STACK' },
    { id: 37, name: 'MYSTERY EJECT' },
    { id: 38, name: 'RIGHT EJECT' },

    { id: 41, name: 'LOCK BALL 1' },
    { id: 42, name: 'LOCK BALL 2' },
    { id: 43, name: 'LOCK BALL 3' },
    { id: 44, name: 'MINE SHAFT' },
    { id: 45, name: 'LEFT LOOP' },
    { id: 46, name: 'LEFT BANK TOP' },
    { id: 47, name: 'LEFT BANK CENTER' },
    { id: 48, name: 'LEFT BANK BOTTOM' },

    { id: 51, name: 'TRAVI' },
    { id: 52, name: 'COM' },
    { id: 53, name: '2-WAY POPPER' },
    { id: 54, name: '"WE ARE" STANDUP TARGET' },
    { id: 55, name: '"WATCHING" STANDUP TARGET' },
    { id: 56, name: 'PERIMETER DEFENSE' },
    { id: 57, name: 'LEFT RAMP ENTER' },
    { id: 58, name: 'LEFT RAMP EXIT' },

    { id: 61, name: 'LEFT SLINGSHOT' },
    { id: 62, name: 'RIGHT SLINGSHOT' },
    { id: 63, name: 'LEFT JET BUMPER' },
    { id: 64, name: 'RIGHT JET BUMPER' },
    { id: 65, name: 'BOTTOM JET BUMPER' },
    { id: 67, name: 'RIGHT RAMP ENTER' },
    { id: 68, name: 'RIGHT RAMP EXIT' },

    { id: 71, name: '(A)MY' },
    { id: 72, name: 'A(M)Y' },
    { id: 73, name: 'AM(Y)' },
    { id: 74, name: '(C)ONGO' },
    { id: 75, name: 'C(O)NGO' },
    { id: 76, name: 'CO(N)GO' },
    { id: 77, name: 'CON(G)O' },
    { id: 78, name: 'CONG(O)' },
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
    image: 'playfield-congo.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 41, 42, 43
      31, 41, 42, 43,
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
    checksum: [
      { dataStartOffset: 0x1CE3, dataEndOffset: 0x1D06, checksumOffset: 0x1D07, checksum: '16bit', name: 'HI_SCORE' },
      { dataStartOffset: 0x1D09, dataEndOffset: 0x1D11, checksumOffset: 0x1D12, checksum: '16bit', name: 'CHAMPION' },
    ],
    knownValues: [
      { offset: 0x80, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      //{ offset: 0x326, name: 'TEXT', description: 'random visible text', type: 'string' },
      { offset: 0x3B2, name: 'GAME_PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x3B3, name: 'GAME_BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

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

      { offset: 0x1913, name: 'STAT_LEFT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x1919, name: 'STAT_RIGHT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x19FD, name: 'STAT_LEFT_FLIPPER_TRIG', type: 'uint8', length: 3 },
      { offset: 0x1A03, name: 'STAT_RIGHT_FLIPPER_TRIG', type: 'uint8', length: 3 },

      { offset: 0x1CE3, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1CE7, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CEC, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1CF0, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CF5, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1CF9, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CFE, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D02, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D09, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D0D, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },

      { offset: 0x1711, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },
      { offset: 0x1D10, name: 'GAME_CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1D11, name: 'GAME_CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
    ]
  },
};
