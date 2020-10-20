'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Black Rose',
  version: 'L-3',
  pinmame: {
    knownNames: [ 'br_p17', 'br_p18', 'br_l1', 'br_d1', 'br_l3', 'br_d3', 'br_l4', 'br_d4' ],
    gameName: 'Black Rose',
    id: 'br',
  },
  rom: {
    u06: 'u6-l3.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'OUTHOLE' },
    { id: 16, name: 'RIGHT TROUGH' },
    { id: 17, name: 'CENTER TROUGH' },
    { id: 18, name: 'LEFT TROUGH' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'SHOOTER' },
    { id: 26, name: 'LEFT OUTLANE' },
    { id: 27, name: 'LEFT RETURN LANE' },
    { id: 28, name: 'LEFT SLINGSHOT' },

    { id: 31, name: 'BOT STANDUPS BOT' },
    { id: 32, name: 'BOT STANDUPS MID' },
    { id: 33, name: 'BOT STANDUPS TOP' },
    { id: 34, name: 'FIRE BUTTON' },
    { id: 35, name: 'CANNON KICKER' },
    { id: 36, name: 'RIGHT OUTLANE' },
    { id: 37, name: 'IGHT RETURN LANE' },
    { id: 38, name: 'RIGHT SLINGSHOT' },

    { id: 41, name: 'MID STANDUPS TOP' },
    { id: 42, name: 'MID STANDUPS MID' },
    { id: 43, name: 'MID STANDUPS BOT' },
    { id: 44, name: 'L RAMP ENTER' },
    { id: 45, name: 'TOP LEFT LOOP' },
    { id: 46, name: 'LEFT JET' },
    { id: 47, name: 'RIGHT JET' },
    { id: 48, name: 'BOTTOM JET' },

    { id: 51, name: 'TOP STANDUPS BOT' },
    { id: 52, name: 'TOP STANDUPS MID' },
    { id: 53, name: 'TOP STANDUPS TOP' },
    { id: 54, name: 'RAMP DOWN' },
    { id: 55, name: 'BALL POPPER' },
    { id: 56, name: 'R RAMP MADE' },
    { id: 57, name: 'JETS EXIT' },
    { id: 58, name: 'JETS ENTER' },

    { id: 61, name: 'SUBWAY TOP' },
    { id: 62, name: 'BACKBOARD RAMP' },
    { id: 63, name: 'LOCKUP 1' },
    { id: 64, name: 'LOCKUP 2' },
    { id: 65, name: 'R SINGLE STANDUP' },
    { id: 66, name: 'SUBWAY BOTTOM' },

    { id: 71, name: 'LOCKUP ENTER' },
    { id: 72, name: 'MIDDLE RAMP' },
    { id: 76, name: 'R RAMP ENTER' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-br.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  cabinetColors: [
    '#FAE24D',
    '#E53D28',
    '#3582D4',
    '#C2B38B',
  ],
  initialise: {
    closedSwitches: [
      22,
      16, 17, 18,
    ],
    initialAction: [
      {
        delayMs: 1500,
        source: 'cabinetInput',
        value: 16
      }
    ],
  },
  memoryPosition: {
    knownValues: [
      { offset: 0x80, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x48B, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x1730, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x1736, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x173C, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x1742, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

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

      { offset: 0x1C6D, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1C70, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C75, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1C78, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C7D, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1C80, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C85, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1C88, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1C8F, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1C92, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  }
};
