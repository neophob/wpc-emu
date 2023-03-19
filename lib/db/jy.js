module.exports = {
  name: 'WPC-95: Junk Yard',
  version: '1.2',
  pinmame: {
    knownNames: [ 'jy_03', 'jy_11', 'jy_12', 'jy_12c' ],
    gameName: 'Junk Yard',
    id: 'jy',
  },
  rom: {
    u06: 'jy_g11.1_2',
  },
  switchMapping: [
    { id: 11, name: 'TOASTER GUN' },
    { id: 12, name: 'REBOUND SW' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'TOP LEFT CRANE' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'LEFT RETURN LANE' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 26, name: 'RIGHT RETURN LANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'CRANE DOWN' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LOCK UP 2' },
    { id: 37, name: 'LOCK UP 1' },
    { id: 38, name: 'TOP RIGHT CRANE' },

    { id: 41, name: 'PAST SPINNER' },
    { id: 42, name: 'IN THE SEWER' },
    { id: 43, name: 'LOCK JAM' },
    { id: 44, name: 'PAST CRANE' },
    { id: 45, name: 'RAMP EXIT' },
    { id: 46, name: 'CAR TARG 1 LEFT' },
    { id: 47, name: 'CAR TARG 2' },
    { id: 48, name: 'CAR TARG 3' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'CAR TARG 4' },
    { id: 54, name: 'CAR TARG 5 RGHT' },
    { id: 56, name: 'L L 3 BANK BOT' },
    { id: 57, name: 'L L 3 BANK MID' },
    { id: 58, name: 'L L 3 BANK TOP' },

    { id: 61, name: 'U R 3 BANK BOT' },
    { id: 62, name: 'U R 3 BANK MID' },
    { id: 63, name: 'U R 3 BANK TOP' },
    { id: 64, name: 'U L 3 BANK BOT' },
    { id: 65, name: 'U L 3 BANK MID' },
    { id: 66, name: 'U L 3 BANK TOP' },
    { id: 67, name: 'BOWL ENTRY' },
    { id: 68, name: 'BOWL EXIT' },

    { id: 71, name: 'RAMP ENTRY' },
    { id: 72, name: 'SCOOP DOWN' },
    { id: 73, name: 'SCOOP MADE' },
    { id: 74, name: 'DOG ENTRY' },
    { id: 76, name: 'R 3 BANK BOTTOM' },
    { id: 77, name: 'R 3 BANK MIDDLE' },
    { id: 78, name: 'R 3 BANK TOP' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'SPINNER' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
    { id: 'F8', name: 'UL FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-jy.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  cabinetColors: [
    '#DB5752',
    '#E9CE80',
    '#7CA8D6',
    '#D77D5D',
    '#D0635B'
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44
      31, 36, 37, 41, 42, 43, 44,
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

      { offset: 0x440, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },
      { offset: 0x596, name: 'GAME_ATTRACTMODE_SEQ', description: 'Game specific sequence of attract mode, could be used to skip some screens', type: 'uint8' },

      { offset: 0x16A1, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x16A7, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x16AD, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x16B3, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

      { offset: 0x180C, name: 'STAT_GAME_ID', type: 'string' },
      { offset: 0x1883, name: 'STAT_GAMES_STARTED', type: 'uint8', length: 3 },
      { offset: 0x1889, name: 'STAT_TOTAL_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x188F, name: 'STAT_TOTAL_FREE_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x18BF, name: 'STAT_MINUTES_ON', description: 'Minutes powered on', type: 'uint8', length: 3 },
      { offset: 0x18B9, name: 'STAT_PLAYTIME', description: 'Minutes playing', type: 'uint8', length: 3 },
      { offset: 0x18C5, name: 'STAT_BALLS_PLAYED', type: 'uint8', length: 3 },
      { offset: 0x18CB, name: 'STAT_TILT_COUNTER', type: 'uint8', length: 5 },
      { offset: 0x18E9, name: 'STAT_1_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18EF, name: 'STAT_2_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18F5, name: 'STAT_3_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18FB, name: 'STAT_4_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
    ],
  }
};
