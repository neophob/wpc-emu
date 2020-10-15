'use strict';

module.exports = {
  name: 'WPC-95: Cactus Canyon',
  version: '1.3',
  pinmame: {
    knownNames: [ 'cc_10', 'cc_12', 'cc_13', 'cc_13k', 'cc_104' ],
    gameName: 'Cactus Canyon',
    id: 'cc',
  },
  rom: {
    u06: 'cc_g11.1_3',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'MINE ENTRANCE' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'R RETURN' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 26, name: 'L RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'R STANDUP (BOT)' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'L LOOP BOTTOM' },
    { id: 37, name: 'RT LOOP BOTTOM' },

    { id: 41, name: 'MINE POPPER' },
    { id: 42, name: 'SALOON POPPER' },
    { id: 44, name: 'R STANDUP (TOP)' },
    { id: 46, name: 'BEER MUG SWITCH' },
    { id: 47, name: 'L BONUS X LANE' },
    { id: 48, name: 'JET EXIT' },

    { id: 51, name: 'L SLINGSHOT' },
    { id: 52, name: 'R SLINGSHOT' },
    { id: 53, name: 'LEFT JET' },
    { id: 54, name: 'RIGHT JET' },
    { id: 55, name: 'BOTTOM JET' },
    { id: 56, name: 'RIGHT LOOP TOP' },
    { id: 57, name: 'R BONUS X LANE' },
    { id: 58, name: 'LEFT LOOP TOP' },

    { id: 61, name: 'DROP #1 (L)' },
    { id: 62, name: 'DROP #2 (LC)' },
    { id: 63, name: 'DROP #3 (RC)' },
    { id: 64, name: 'DROP #4 (R)' },
    { id: 65, name: 'R RAMP MAKE' },
    { id: 66, name: 'R RAMP ENTER' },
    { id: 67, name: 'SKILL BOWL' },
    { id: 68, name: 'BOT R RAMP' },

    { id: 71, name: 'TRAIN ENCODER' },
    { id: 72, name: 'TRAIN HOME' },
    { id: 73, name: 'SALOON GATE' },
    { id: 75, name: 'SALOON BART TOY' },
    { id: 77, name: 'MINE HOME' },
    { id: 78, name: 'MINE ENCODER' },

    { id: 82, name: 'C RAMP ENTER' },
    { id: 83, name: 'L RAMP MAKE' },
    { id: 84, name: 'C RAMP MAKE' },
    { id: 85, name: 'L RAMP ENTER' },
    { id: 86, name: 'L STANDUP (TOP)' },
    { id: 87, name: 'L STANDUP (BOT)' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'LR FLIPPER EOS' },
    { id: 'F2', name: 'LR FLIPPER BUTTON' },
    { id: 'F3', name: 'LL FLIPPER EOS' },
    { id: 'F4', name: 'LL FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-cc.jpg',
    lamps: [
      [{ x: 56, y: 287, color: 'YELLOW' }],
      [{ x: 72, y: 277, color: 'YELLOW' }],
      [{ x: 90, y: 273, color: 'YELLOW' }],
      [{ x: 110, y: 277, color: 'YELLOW' }],
      [{ x: 125, y: 287, color: 'YELLOW' }],
      [{ x: 90, y: 285, color: 'YELLOW' }],
      [{ x: 20, y: 10, color: 'WHITE' }],
      [{ x: 30, y: 10, color: 'WHITE' }],

      [{ x: 127, y: 264, color: 'WHITE' }], // 21
      [{ x: 115, y: 257, color: 'WHITE' }],
      [{ x: 120, y: 246, color: 'WHITE' }],
      [{ x: 103, y: 253, color: 'WHITE' }],
      [{ x: 121, y: 114, color: 'WHITE' }],
      [{ x: 121, y: 133, color: 'YELLOW' }],
      [{ x: 72, y: 155, color: 'RED' }],
      [{ x: 75, y: 174, color: 'GREEN' }],

      [{ x: 116, y: 178, color: 'YELLOW' }], // 31
      [{ x: 53, y: 207, color: 'YELLOW' }],
      [{ x: 37, y: 242, color: 'YELLOW' }],
      [{ x: 136, y: 234, color: 'LPURPLE' }],
      [{ x: 144, y: 221, color: 'LPURPLE' }],
      [{ x: 149, y: 208, color: 'LPURPLE' }],
      [{ x: 156, y: 194, color: 'RED' }],
      [{ x: 162, y: 176, color: 'WHITE' }],

      [{ x: 153, y: 117, color: 'WHITE' }], // 41
      [{ x: 149, y: 135, color: 'RED' }],
      [{ x: 140, y: 144, color: 'LBLUE' }],
      [{ x: 139, y: 151, color: 'LBLUE' }],
      [{ x: 137, y: 157, color: 'LBLUE' }],
      [{ x: 27, y: 194, color: 'YELLOW' }],
      [{ x: 38, y: 335, color: 'WHITE' }],
      [{ x: 12, y: 317, color: 'RED' }],

      [{ x: 143, y: 188, color: 'YELLOW' }], // 51
      [{ x: 149, y: 245, color: 'YELLOW' }],
      [{ x: 154, y: 229, color: 'YELLOW' }],
      [{ x: 95, y: 190, color: 'GREEN' }],
      [{ x: 95, y: 177, color: 'GREEN' }],
      [{ x: 95, y: 163, color: 'GREEN' }],
      [{ x: 95, y: 149, color: 'RED' }],
      [{ x: 95, y: 125, color: 'WHITE' }],

      [{ x: 75, y: 241, color: 'LBLUE' }], // 61
      [{ x: 72, y: 227, color: 'LBLUE' }],
      [{ x: 68, y: 213, color: 'LBLUE' }],
      [{ x: 65, y: 201, color: 'RED' }],
      [{ x: 58, y: 177, color: 'WHITE' }],
      [{ x: 154, y: 295, color: 'YELLOW' }],
      [{ x: 169, y: 317, color: 'RED' }],
      [{ x: 143, y: 337, color: 'WHITE' }],

      [{ x: 62, y: 307, color: 'YELLOW' }], // 71
      [{ x: 118, y: 307, color: 'YELLOW' }],
      [{ x: 108, y: 335, color: 'YELLOW' }],
      [{ x: 28, y: 178, color: 'WHITE' }],
      [{ x: 34, y: 200, color: 'RED' }],
      [{ x: 30, y: 210, color: 'LPURPLE' }],
      [{ x: 43, y: 218, color: 'LPURPLE' }],
      [{ x: 48, y: 230, color: 'LPURPLE' }],

      [{ x: 91, y: 313, color: 'YELLOW' }], // 81
      [{ x: 91, y: 373, color: 'RED' }],
      [{ x: 73, y: 335, color: 'YELLOW' }],
      [{ x: 81, y: 208, color: 'YELLOW' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 12, y: 394, color: 'YELLOW' }],
    ],
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#EACD52',
    '#A73A32',
    '#718F49',
    '#4D779C',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41, 42
      31, 41, 42,
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

      { offset: 0x455, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },
      { offset: 0x584, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

      { offset: 0x16A0, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x16A7, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x16AE, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x16B5, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

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
      { offset: 0x1CDC, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CE1, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1CE4, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CE9, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1CEC, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CF1, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1CF4, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CFB, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1CFE, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
