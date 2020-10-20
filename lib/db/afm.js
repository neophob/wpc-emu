'use strict';

module.exports = {
  name: 'WPC-95: Attack from Mars',
  version: '1.13b',
  pinmame: {
    knownNames: [ 'afm_10', 'afm_11', 'afm_11u', 'afm_113', 'afm_113b' ],
    gameName: 'Attack from Mars',
    id: 'afm',
  },
  rom: {
    u06: 'afm_113b.bin',
  },
  switchMapping: [
    { id: 11, name: 'LAUNCH BUTTON' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT RETURN' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LEFT POPPER' },
    { id: 37, name: 'RIGHT POPPER' },
    { id: 38, name: 'LEFT TOP LANE' },

    { id: 41, name: 'MARTI"A"N TARGET' },
    { id: 42, name: 'MARTIA"N" TARGET' },
    { id: 43, name: 'MAR"T"IAN TARGET' },
    { id: 44, name: 'MART"I"AN TARGET' },
    { id: 45, name: 'L MOTOR BANK' },
    { id: 46, name: 'C MOTOR BANK' },
    { id: 47, name: 'R MOTOR BANK' },
    { id: 48, name: 'RIGHT TOP LANE' },

    { id: 51, name: 'LEFT SLINGSHOT' },
    { id: 52, name: 'RIGHT SLINGSHOT' },
    { id: 53, name: 'LEFT JET' },
    { id: 54, name: 'BOTTOM JET' },
    { id: 55, name: 'RIGHT JET' },
    { id: 56, name: '"M"ARTIAN TARGET' },
    { id: 57, name: 'M"A"RTIAN TARGET' },
    { id: 58, name: 'MA"R"TIAN TARGET' },

    { id: 61, name: 'L RAMP ENTER' },
    { id: 62, name: 'C RAMP ENTER' },
    { id: 63, name: 'R RAMP ENTER' },
    { id: 64, name: 'L RAMP EXIT' },
    { id: 65, name: 'R RAMP EXIT' },
    { id: 66, name: 'MOTOR BANK DOWN' },
    { id: 67, name: 'MOTOR BANK UP' },

    { id: 71, name: 'RIGHT LOOP HI' },
    { id: 72, name: 'RIGHT LOOP LO' },
    { id: 73, name: 'LEFT LOOP HI' },
    { id: 74, name: 'LEFT LOOP LO' },
    { id: 75, name: 'L SAUCER TGT' },
    { id: 76, name: 'R SAUCER TGT' },
    { id: 77, name: 'DROP TARGET' },
    { id: 78, name: 'CENTER TROUGH' },
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
    image: 'playfield-afm.jpg',
    lamps: [
      [{ x: 71, y: 318, color: 'GREEN' }],
      [{ x: 61, y: 326, color: 'GREEN' }],
      [{ x: 81, y: 309, color: 'GREEN' }],
      [{ x: 99, y: 309, color: 'GREEN' }],
      [{ x: 91, y: 330, color: 'RED' }],
      [{ x: 110, y: 318, color: 'GREEN' }],
      [{ x: 120, y: 326, color: 'GREEN' }],
      [{ x: 102, y: 92, color: 'RED' }],

      [{ x: 61, y: 241, color: 'RED' }], // 21
      [{ x: 58, y: 224, color: 'RED' }],
      [{ x: 53, y: 207, color: 'RED' }],
      [{ x: 49, y: 191, color: 'RED' }],
      [{ x: 44, y: 172, color: 'RED' }],
      [{ x: 71, y: 188, color: 'GREEN' }],
      [{ x: 68, y: 175, color: 'GREEN' }],
      [{ x: 65, y: 159, color: 'RED' }],

      [{ x: 126, y: 248, color: 'RED' }], // 31
      [{ x: 131, y: 232, color: 'RED' }],
      [{ x: 135, y: 215, color: 'RED' }],
      [{ x: 142, y: 199, color: 'RED' }],
      [{ x: 145, y: 182, color: 'RED' }],
      [{ x: 125, y: 181, color: 'YELLOW' }],
      [{ x: 122, y: 193, color: 'GREEN' }],
      [{ x: 128, y: 169, color: 'ORANGE' }],

      [{ x: 175, y: 159, color: 'RED' }], // 41
      [{ x: 61, y: 143, color: 'RED' }],
      [{ x: 125, y: 23, color: 'RED' }],
      [{ x: 145, y: 22, color: 'RED' }],
      [{ x: 89, y: 136, color: 'RED' }],
      [{ x: 99, y: 136, color: 'RED' }],
      [{ x: 109, y: 136, color: 'RED' }],
      [{ x: 78, y: 147, color: 'GREEN' }],

      [{ x: 99, y: 260, color: 'RED' }], // 51
      [{ x: 99, y: 244, color: 'RED' }],
      [{ x: 99, y: 227, color: 'RED' }],
      [{ x: 76, y: 215, color: 'YELLOW' }],
      [{ x: 74, y: 203, color: 'GREEN' }],
      [{ x: 99, y: 212, color: 'RED' }],
      [{ x: 99, y: 196, color: 'RED' }],
      [{ x: 99, y: 179, color: 'RED' }],

      [{ x: 151, y: 252, color: 'YELLOW' }], // 61
      [{ x: 150, y: 240, color: 'YELLOW' }],
      [{ x: 155, y: 219, color: 'ORANGE' }],
      [{ x: 159, y: 206, color: 'ORANGE' }],
      [{ x: 163, y: 192, color: 'RED' }],
      [{ x: 168, y: 176, color: 'RED' }],
      [{ x: 131, y: 156, color: 'RED' }],
      [{ x: 122, y: 147, color: 'GREEN' }],

      [{ x: 32, y: 208, color: 'YELLOW' }], // 71
      [{ x: 28, y: 194, color: 'YELLOW' }],
      [{ x: 24, y: 180, color: 'YELLOW' }],
      [{ x: 21, y: 164, color: 'RED' }],
      [{ x: 16, y: 148, color: 'RED' }],
      [{ x: 32, y: 264, color: 'GREEN' }],
      [{ x: 34, y: 253, color: 'GREEN' }],
      [{ x: 37, y: 242, color: 'GREEN' }],

      [{ x: 91, y: 380, color: 'RED' }], // 81
      [{ x: 8, y: 304, color: 'YELLOW' }],
      [{ x: 24, y: 296, color: 'YELLOW' }],
      [{ x: 159, y: 296, color: 'YELLOW' }],
      [{ x: 173, y: 304, color: 'YELLOW' }],
      [{ x: 180, y: 390, color: 'RED' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 10, y: 390, color: 'RED' }],
    ],
    flashlamps: [
      { id: 17, x: 184, y: 40 },
      { id: 18, x: 157, y: 79 },
      { id: 19, x: 188, y: 188 },
      { id: 20, x: 174, y: 251 },
      { id: 21, x: 99, y: 160 },
      { id: 22, x: 150, y: 63 },
      { id: 23, x: 102, y: 93 },
      { id: 25, x: 14, y: 28 },
      { id: 26, x: 74, y: 21 },
      { id: 27, x: 20, y: 120 },
      { id: 28, x: 237, y: 153 },
    ],
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#FBF853',
    '#E63228',
    '#CFED4E',
    '#4DA23C',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37
      31, 36, 37, 67,
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
        offset: 0x1C18,
        value: 0x01,
      },
    ],
  },
  memoryPosition: {
    checksum: [
      { dataStartOffset: 0x1D0B, dataEndOffset: 0x1D2E, checksumOffset: 0x1D2F, checksum: '16bit', name: 'HI_SCORE' },
      { dataStartOffset: 0x1D31, dataEndOffset: 0x1D39, checksumOffset: 0x1D3A, checksum: '16bit', name: 'CHAMPION' },
      { dataStartOffset: 0x1B98, dataEndOffset: 0x1CA2, checksumOffset: 0x1CA3, checksum: '16bit', name: 'ADJUSTMENT' },
    ],
    knownValues: [
      { offset: 0x80, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x3B5, name: 'GAME_PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x3B6, name: 'GAME_BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

      { offset: 0x443, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },
      { offset: 0x574, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

      { offset: 0x16A0, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x16A7, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x16AE, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x16B5, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

      { offset: 0x1711, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

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

      { offset: 0x1B98, name: 'GAME_BALL_TOTAL', description: 'Balls per game', type: 'uint8' },
      { offset: 0x1C18, name: 'STAT_FREEPLAY', description: '0: not free, 1: free', type: 'uint8' },

      { offset: 0x1D0B, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D0E, name: 'HISCORE_1_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1D14, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D17, name: 'HISCORE_2_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1D1D, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D20, name: 'HISCORE_3_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1D26, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D29, name: 'HISCORE_4_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1D31, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D34, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 6 },

      { offset: 0x1D42, name: 'GAME_CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1D43, name: 'GAME_CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
    ]
  },
};
