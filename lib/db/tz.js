'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Twilight Zone',
  version: 'H-8',
  pinmame: {
    knownNames: [
      'tz_pa1', 'tz_pa2', 'tz_p3', 'tz_p3d', 'tz_p4', 'tz_p5', 'tz_l1', 'tz_d1', 'tz_l2', 'tz_d2', 'tz_l3', 'tz_d3', 'tz_ifpa', 'tz_ifpa2', 'tz_l4', 'tz_d4',
      'tz_h7', 'tz_i7', 'tz_h8', 'tz_i8', 'tz_92', 'tz_93', 'tz_94h', 'tz_94ch',
    ],
    gameName: 'Twilight Zone',
    id: 'tz',
  },
  rom: {
    u06: 'tz_h8.u6',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT INLANE' },
    { id: 12, name: 'RIGHT OUTLANE' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RIGHT TROUGH' },
    { id: 16, name: 'CENTER TROUGH' },
    { id: 17, name: 'LEFT TROUGH' },
    { id: 18, name: 'OUTHOLE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: 'FAR L TROUGH' },
    { id: 26, name: 'TROUGH PROXIMITY' },
    { id: 27, name: 'BALL SHOOTER' },
    { id: 28, name: 'ROCKET KICKER' },

    { id: 31, name: 'LEFT JET BUMPER' },
    { id: 32, name: 'RIGHT JET BUMPER' },
    { id: 33, name: 'LOWER JET BUMPER' },
    { id: 34, name: 'LEFT SLINGSHOT' },
    { id: 35, name: 'RIGHT SLINGSHOT' },
    { id: 36, name: 'LEFT OUTLANE' },
    { id: 37, name: 'LEFT INLANE 1' },
    { id: 38, name: 'LEFT INLANE 2' },

    { id: 41, name: 'DEAD END' },
    { id: 42, name: 'THE CAMERA' },
    { id: 43, name: 'PLAYER PIANO' },
    { id: 44, name: 'MINI PF ENTER' },
    { id: 45, name: 'MINI PF LEFT (2)' },
    { id: 46, name: 'MINI PF RGHT (2)' },
    { id: 47, name: 'CLOCK MILLIONS' },
    { id: 48, name: 'LOW LEFT 5 MIL' },

    { id: 51, name: 'GUM POPPER LANE' },
    { id: 52, name: 'HITCH-HIKER' },
    { id: 53, name: 'LEFT RAMP ENTER' },
    { id: 54, name: 'LEFT RAMP' },
    { id: 55, name: 'GUMBALL GENEVA' },
    { id: 56, name: 'GUMBALL EXIT' },
    { id: 57, name: 'SLOT PROXIMITY' },
    { id: 58, name: 'SLOT KICKOUT' },

    { id: 61, name: 'LOWER SKILL' },
    { id: 62, name: 'CENTER SKILL' },
    { id: 63, name: 'UPPER SKILL' },
    { id: 64, name: 'U RIGHT 5 MIL' },
    { id: 65, name: 'POWER PAYLOFF (2)' },
    { id: 66, name: 'MID R 5 MIL 1' },
    { id: 67, name: 'MID R 5 MIL 2' },
    { id: 68, name: 'LOW RIGHT 5 MIL' },

    { id: 72, name: 'AUTO-FIRE KICKER' },
    { id: 73, name: 'RIGHT RAMP' },
    { id: 74, name: 'GUMBALL POPPER' },
    { id: 75, name: 'MINI PF TOP' },
    { id: 76, name: 'MINI PF EXIT' },
    { id: 77, name: 'MID LEFT 5 MIL' },
    { id: 78, name: 'U LEFT 5 MIL' },

    { id: 81, name: 'RIGHT MAGNET' },
    { id: 83, name: 'LEFT MAGNET' },
    { id: 84, name: 'LOCK CENTER' },
    { id: 85, name: 'LOCK UPPER' },
    { id: 87, name: 'GUMBALL ENTER' },
    { id: 88, name: 'LOCK LOWER' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-tz.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  cabinetColors: [
    '#FCEB4F',
    '#CB322C',
    '#47A5DF',
    '#C27133',
  ],
  initialise: {
    closedSwitches: [
      15, 16, 17,
      22,
      //OPTO SWITCHES:
      71, 72, 73, 74, 75, 76, 81, 82, 83, 84, 85, 86, 87,
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

      { offset: 0x431, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

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

      { offset: 0x1D49, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D4D, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D52, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D56, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D5B, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D5F, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D30, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D68, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D6F, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D73, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  },
  testErrors: [
    'CLOCK IS BROKEN',
  ]
};
