'use strict';

module.exports = {
  name: 'WPC-S: World Cup Soccer',
  version: 'LX-2',
  pinmame: {
    knownNames: [ 'wcs_l2', 'wcs_d2', 'wcs_l3c', 'wcs_la2', 'wcs_p2', 'wcs_p5', 'wcs_p3', 'wcs_p6' ],
    gameName: 'World Cup Soccer',
    id: 'wcs',
  },
  rom: {
    u06: 'WCUP_LX2.ROM',
  },
  switchMapping: [
    { id: 12, name: 'MAG GOALIE BUT' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'L FLIPPER LANE' },
    { id: 16, name: 'STRIKER 3 (HIGH)' },
    { id: 17, name: 'R FLIPPER LANE' },
    { id: 18, name: 'RIGHT OUTLANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY EXTRA BALL' },
    { id: 25, name: 'FREE KICK TARGET' },
    { id: 26, name: 'KICKBACK UPPER' },
    { id: 27, name: 'SPINNER' },
    { id: 28, name: 'LIGHT KICKBACK' },

    { id: 31, name: 'TROUGH 1 (RIGHT)' },
    { id: 32, name: 'TROUGH 2' },
    { id: 33, name: 'TROUGH 3' },
    { id: 34, name: 'TROUGH 4' },
    { id: 35, name: 'TROUGH 5 (LEFT)' },
    { id: 36, name: 'TROUGH STACK' },
    { id: 37, name: 'LIGHT MAG GOALIE' },
    { id: 38, name: 'BALLSHOOTER' },

    { id: 41, name: 'GOAL TROUGH' },
    { id: 42, name: 'GOAL POPPER OPTO' },
    { id: 43, name: 'GOALIE IS LEFT' },
    { id: 44, name: 'GOALIE IS RIGHT' },
    { id: 45, name: 'TV BALL POPPER' },
    { id: 47, name: 'TRAVEL LANE ROLO' },
    { id: 48, name: 'GOALIE TARGET' },

    { id: 51, name: 'SKILL SHOT FRONT' },
    { id: 52, name: 'SKILL SHOT CENT' },
    { id: 53, name: 'SKILL SHOT REAR' },
    { id: 54, name: 'RIGHT EJECT HOLE' },
    { id: 55, name: 'UPPER EJECT HOLE' },
    { id: 56, name: 'LEFT EJECT HOLE' },
    { id: 57, name: 'R LANE HI-UNUSED' },
    { id: 58, name: 'R LANE LO-UNUSED' },

    { id: 61, name: 'ROLLOVER 1(HIGH)' },
    { id: 62, name: 'ROLLOVER 2' },
    { id: 63, name: 'ROLLOVER 3' },
    { id: 64, name: 'ROLLOVER 4 (LOW)' },
    { id: 65, name: 'TACKLE SWITCH' },
    { id: 66, name: 'STRIKER 1 (LEFT)' },
    { id: 67, name: 'STRIKER 2 (CENT)' },

    { id: 71, name: 'L RAMP DIVERTED' },
    { id: 72, name: 'L RAMP ENTRANCE' },
    { id: 74, name: 'LEFT RAMP EXIT' },
    { id: 75, name: 'R RAMP ENTRANCE' },
    { id: 76, name: 'LOCK MECH LOW' },
    { id: 77, name: 'LOCK MECH HIGH' },
    { id: 78, name: 'RIGHT RAMP EXIT' },

    { id: 81, name: 'LEFT JET BUMPER' },
    { id: 82, name: 'UPPER JET BUMPER' },
    { id: 83, name: 'LOWER JET BUMPER' },
    { id: 84, name: 'LEFT SLINGSHOT' },
    { id: 85, name: 'RIGHT SLINGSHOT' },
    { id: 86, name: 'KICKBACK' },
    { id: 87, name: 'UPPER LEFT LANE' },
    { id: 88, name: 'UPPER RIGHT LANE' },
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
    image: 'playfield-wcs.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#4F4EB2',
    '#59C5CC',
    '#EDE34C',
    '#D13A2A',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 41, 42, 43, 44, 45, 51, 52, 53
      36, 41, 42, 43, 44, 45, 51, 52, 53,
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

      { offset: 0x49D, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x1730, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x1737, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x173E, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x1745, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

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

      { offset: 0x1CED, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1CF1, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CF6, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1CFA, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1CFF, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D03, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D08, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D0C, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D13, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D17, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },

    ],
  },
};
