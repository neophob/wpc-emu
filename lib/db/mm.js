'use strict';

module.exports = {
  name: 'WPC-95: Medieval Madness',
  version: 'L-8',
  pinmame: {
    knownNames: [ 'mm_05', 'mm_10', 'mm_10u', 'mm_109', 'mm_109b', 'mm_109c' ],
    gameName: 'Medieval Madness',
    id: 'mm',
  },
  rom: {
    u06: 'mm_109b.bin',
  },
  switchMapping: [
    { id: 11, name: 'LAUNCH BUTTON' },
    { id: 12, name: 'CATAPULT TARGET' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'L TROLL TARGET' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT RETURN' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 25, name: 'R TROLL TARGET' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'RIGHT EJECT' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LEFT POPPER' },
    { id: 37, name: 'CASTLE GATE' },
    { id: 38, name: 'CATAPULT' },

    { id: 41, name: 'MOAT ENTER' },
    { id: 44, name: 'CASTLE LOCK' },
    { id: 45, name: 'L TROLL (U/PLDF)' },
    { id: 46, name: 'R TROLL (U/PLDF)' },
    { id: 47, name: 'LEFT TOP LANE' },
    { id: 48, name: 'RIGHT TOP LANE' },

    { id: 51, name: 'LEFT SLINGSHOT' },
    { id: 52, name: 'RIGHT SLINGSHOT' },
    { id: 53, name: 'LEFT JET' },
    { id: 54, name: 'BOTTOM JET' },
    { id: 55, name: 'RIGHT JET' },
    { id: 56, name: 'DRAWBRIDGE UP' },
    { id: 57, name: 'DRAWBRIDGE DOWN' },
    { id: 58, name: 'TOWER EXIT' },

    { id: 61, name: 'L RAMP ENTER' },
    { id: 62, name: 'L RAMP EXIT' },
    { id: 63, name: 'R RAMP ENTER' },
    { id: 64, name: 'R RAMP EXIT' },
    { id: 65, name: 'LEFT LOOP LO' },
    { id: 66, name: 'LEFT LOOP HI' },
    { id: 67, name: 'RIGHT LOOP LO' },
    { id: 68, name: 'RIGHT LOOP HI' },

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
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-mm.jpg',
    lamps: [
      [{ x: 149, y: 245, color: 'WHITE' }],
      [{ x: 150, y: 256, color: 'WHITE' }],
      [{ x: 151, y: 268, color: 'WHITE' }],
      [{ x: 127, y: 213, color: 'RED' }],
      [{ x: 122, y: 229, color: 'YELLOW' }],
      [{ x: 116, y: 243, color: 'YELLOW' }],
      [{ x: 113, y: 255, color: 'YELLOW' }],
      [{ x: 110, y: 266, color: 'YELLOW' }],

      [{ x: 152, y: 206, color: 'RED' }], // 21
      [{ x: 146, y: 221, color: 'YELLOW' }],
      [{ x: 140, y: 235, color: 'YELLOW' }],
      [{ x: 134, y: 248, color: 'YELLOW' }],
      [{ x: 90, y: 194, color: 'LBLUE' }],
      [{ x: 88, y: 208, color: 'LBLUE' }],
      [{ x: 85, y: 222, color: 'LBLUE' }],
      [{ x: 82, y: 236, color: 'LBLUE' }],

      [{ x: 117, y: 148, color: 'YELLOW' }], // 31
      [{ x: 113, y: 160, color: 'ORANGE' }],
      [{ x: 112, y: 171, color: 'WHITE' }],
      [{ x: 105, y: 208, color: 'YELLOW' }],
      [{ x: 102, y: 220, color: 'ORANGE' }],
      [{ x: 100, y: 233, color: 'YELLOW' }],
      [{ x: 97, y: 247, color: 'YELLOW' }],
      [{ x: 95, y: 260, color: 'YELLOW' }],

      [{ x: 27, y: 178, color: 'RED' }], // 41
      [{ x: 33, y: 194, color: 'YELLOW' }],
      [{ x: 38, y: 209, color: 'YELLOW' }],
      [{ x: 44, y: 222, color: 'YELLOW' }],
      [{ x: 32, y: 236, color: 'RED' }],
      [{ x: 38, y: 249, color: 'WHITE' }],
      [{ x: 45, y: 263, color: 'WHITE' }],
      [{ x: 51, y: 277, color: 'WHITE' }],

      [{ x: 87, y: 127, color: 'RED' }], // 51
      [{ x: 91, y: 148, color: 'WHITE' }],
      [{ x: 90, y: 166, color: 'LBLUE' }],
      [{ x: 91, y: 179, color: 'LBLUE' }],
      [{ x: 143, y: 37, color: 'YELLOW' }],
      [{ x: 158, y: 37, color: 'YELLOW' }],
      [{ x: 78, y: 151, color: 'YELLOW' }],
      [{ x: 104, y: 159, color: 'YELLOW' }],

      [{ x: 111, y: 307, color: 'WHITE' }], // 61
      [{ x: 90, y: 301, color: 'WHITE' }],
      [{ x: 69, y: 307, color: 'WHITE' }],
      [{ x: 54, y: 194, color: 'RED' }],
      [{ x: 59, y: 209, color: 'YELLOW' }],
      [{ x: 63, y: 224, color: 'YELLOW' }],
      [{ x: 66, y: 236, color: 'YELLOW' }],
      [{ x: 70, y: 248, color: 'YELLOW' }],

      [{ x: 108, y: 234, color: 'WHITE' }], // 71
      [{ x: 90, y: 320, color: 'YELLOW' }],
      [{ x: 72, y: 324, color: 'WHITE' }],
      [{ x: 90, y: 341, color: 'WHITE' }],
      [{ x: 66, y: 146, color: 'GREEN' }],
      [{ x: 68, y: 158, color: 'GREEN' }],
      [{ x: 70, y: 170, color: 'YELLOW' }],
      [{ x: 180, y: 110, color: 'YELLOW' }],

      [{ x: 168, y: 302, color: 'RED' }], // 81
      [{ x: 154, y: 293, color: 'RED' }],
      [{ x: 26, y: 293, color: 'RED' }],
      [{ x: 12, y: 302, color: 'RED' }],
      [{ x: 64, y: 134, color: 'GREEN' }],
      [{ x: 90, y: 376, color: 'YELLOW' }],
      [{ x: 163, y: 394, color: 'RED' }],
      [{ x: 19, y: 394, color: 'YELLOW' }],
    ],
    flashlamps: [
      { id: 17, x: 12, y: 193 },
      { id: 18, x: 48, y: 144 },
      { id: 19, x: 20, y: 18 },
      { id: 20, x: 191, y: 55 },
      { id: 21, x: 144, y: 155 },
      { id: 22, x: 117, y: 40 },
      { id: 23, x: 183, y: 235 },
      { id: 24, x: 111, y: 111 },
      { id: 25, x: 36, y: 66 },
    ],
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#F4E784',
    '#48618C',
    '#C73434',
    '#D26B3D',
  ],
  initialise: {
    closedSwitches: [
      22, 56,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41,
      31, 36, 37, 41,
    ],
    initialAction: [
      {
        delayMs: 1500,
        source: 'cabinetInput',
        value: 16
      },
      {
        description: 'enable free play',
        delayMs: 3000,
        source: 'writeMemory',
        offset: 0x1C12,
        value: 0x01,
      },
    ],
  },
  memoryPosition: {
    checksum: [
      { dataStartOffset: 0x1D29, dataEndOffset: 0x1D48, checksumOffset: 0x1D49, checksum: '16bit', name: 'HI_SCORE' },
      { dataStartOffset: 0x1D4B, dataEndOffset: 0x1D52, checksumOffset: 0x1D53, checksum: '16bit', name: 'CHAMPION' },
      { dataStartOffset: 0x1B92, dataEndOffset: 0x1CB2, checksumOffset: 0x1CB3, checksum: '16bit', name: 'ADJUSTMENT' },
    ],
    knownValues: [
      // alternative locations 0x3EB,
      { offset: 0x80, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      //{ offset: 0x326, name: 'TEXT', description: 'random visible text', type: 'string' },
      { offset: 0x3B2, name: 'GAME_PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x3B3, name: 'GAME_BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

      { offset: 0x440, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x56F, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

      { offset: 0x16A0, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x16A6, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x16AC, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x16B2, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

      { offset: 0x170D, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

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

      { offset: 0x1B92, name: 'GAME_BALL_TOTAL', description: 'Balls per game', type: 'uint8' },
      { offset: 0x1C12, name: 'STAT_FREEPLAY', description: '0: not free, 1: free', type: 'uint8' },

      { offset: 0x1D29, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D2C, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D31, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D34, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D39, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D3C, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D41, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D44, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D4B, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D4E, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },

      { offset: 0x1D5B, name: 'GAME_CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1D5C, name: 'GAME_CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
    ],
  }
  //TODO
  //attract mode screen
};

/*
# BALL STATE TOM

INITIAL STATE
- TROUGH 1, TROUGH 2, TROUGH 3 and TROUGH 4 are off (OPTO)
- TROUGH EJECT in on (OPTO)

BALL IN SHOOTER LANE
- TROUGH 1, TROUGH 2, and TROUGH 3 are off (OPTO)
- TROUGH EJECT and THROUGH 4 are on (OPTO)
- SHOOTER LANE is on

BALL IN GAME
- TROUGH 1, TROUGH 2, and TROUGH 3 are off (OPTO)
- TROUGH EJECT and THROUGH 4 are on (OPTO)
- SHOOTER LANE is off

BALL DRAIN
- TROUGH 1, TROUGH 2, TROUGH 3 AND THROUGH 4 are off (OPTO)
- TROUGH EJECT is on (OPTO)
*/
