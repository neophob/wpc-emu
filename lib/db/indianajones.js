module.exports = {
  name: 'WPC-DCS: Indiana Jones, The Pinball Adventure',
  version: 'L-7',
  pinmame: {
    knownNames: [ 'ij_p2', 'ij_l3', 'ij_d3', 'ij_l4', 'ij_d4', 'ij_l5', 'ij_d5', 'ij_l6', 'ij_d6', 'ij_l7', 'ij_d7', 'ij_lg7', 'ij_dg7', 'ij_h1', 'ij_i1' ],
    gameName: 'Indiana Jones: The Pinball Adventure',
    id: 'ij',
  },
  rom: {
    u06: 'ijone_l7.rom',
  },
  switchMapping: [
    { id: 11, name: 'SINGLE DROP' },
    { id: 12, name: 'BUY-IN BUTTON' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT OUTLANE' },
    { id: 16, name: 'LEFT RETURN LANE' },
    { id: 17, name: 'RGHT RETURN LANE' },
    { id: 18, name: 'RGHT OUTLANE TOP' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: '(I)NDY LANE' },
    { id: 26, name: 'I(N)DY LANE' },
    { id: 27, name: 'IN(D)Y LANE' },
    { id: 28, name: 'IND(Y) LANE' },

    { id: 31, name: 'LEFT EJECT' },
    { id: 32, name: 'EXIT IDOL' },
    { id: 33, name: 'LEFT SLINGSHOT' },
    { id: 34, name: 'GUN TRIGGER' },
    { id: 35, name: 'LEFT JET' },
    { id: 36, name: 'RIGHT JET' },
    { id: 37, name: 'BOTTOM JET' },
    { id: 38, name: 'CENTER STANDUP' },

    { id: 41, name: 'LEFT RAMP ENTER' },
    { id: 42, name: 'RIGHT RAMP ENTER' },
    { id: 43, name: 'TOP IDOL ENTER' },
    { id: 44, name: 'RIGHT POPPER' },
    { id: 45, name: 'CENTER ENTER' },
    { id: 46, name: 'TOP POST' },
    { id: 47, name: 'SUBWAY LOOPKUP' },
    { id: 48, name: 'RIGHT SLINGSHOT' },

    { id: 51, name: 'ADVENT(U)RE TRGT' },
    { id: 52, name: 'ADVENTU(R)E TRGT' },
    { id: 53, name: 'ADVENTUR(E) TRGT' },
    { id: 54, name: 'LEFT LOOP TOP' },
    { id: 55, name: 'LEFT LOOP BOTTOM' },
    { id: 56, name: 'RIGHT LOOP TOP' },
    { id: 57, name: 'RIGHT LOOP BOT.' },
    { id: 58, name: 'RGHT OUTLANE BOT' },

    { id: 61, name: '(A)DVENTURE TRGT' },
    { id: 62, name: 'A(D)VENTURE TRGT' },
    { id: 63, name: 'AD(V)ENTURE TRGT' },
    { id: 64, name: 'CAPTVE VALL BACK' },
    { id: 65, name: 'MINI TOP LEFT' },
    { id: 66, name: 'MINI MID TOP LFT' },
    { id: 67, name: 'MINI MID BOT LFT' },
    { id: 68, name: 'MINI COTTOM LEFT' },

    { id: 71, name: 'CAPTVE BALL FRNT' },
    { id: 72, name: 'MINI TOP HOLE' },
    { id: 73, name: 'MINI BOTTOM HOLE' },
    { id: 74, name: 'RIGHT RAMP MADE' },
    { id: 75, name: 'MINI TOP RIGHT' },
    { id: 76, name: 'MINI MID TOP RGT' },
    { id: 77, name: 'MINI MID BOT RGT' },
    { id: 78, name: 'MINI BOTTOM RGT' },

    { id: 81, name: 'TROUGH 6' },
    { id: 82, name: 'TROUGH 5' },
    { id: 83, name: 'TROUGH 4' },
    { id: 84, name: 'TROUGH 3' },
    { id: 85, name: 'TROUGH 2' },
    { id: 86, name: 'TROUGH 1' },
    { id: 87, name: 'TOP TROUGH' },
    { id: 88, name: 'SHOOTER' },

    //TODO 91 - 95
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'DROP ADV(E)NTURE' },
    { id: 'F6', name: 'DROP ADVE(N)TURE' },
    { id: 'F7', name: 'DROP ADVEN(T)URE' },
    { id: 'F8', name: 'LEFT RAMP MADE' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-ij.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcDcs',
  ],
  cabinetColors: [
    '#EC5629',
    '#EDE24C',
    '#4399B9',
    '#DF916D',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 81, 82, 83, 84, 85, 86,
      41, 42, 43, 44, 45, 47, 71, 72, 73,
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

      { offset: 0x43A, name: 'GAME_CURRENT_SCREEN', description: '0x00: attract mode, 0x01: game play/system menu, 0x80: tilt warning, 0xF1: credits view', type: 'uint8' },

      { offset: 0x1730, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x1737, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x173E, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x1745, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

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

      { offset: 0x1D78, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D7B, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D80, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D83, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D88, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D8B, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D90, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D93, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D9A, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1D9D, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },
    ]
  },
  testErrors: [
    'ERR. MINI PFD. BAD, CHK. SWITCHES/MTR',
    'ERROR IDOL BAD, CHK. SWITCHES/MTR',
    'ERR. DROP BNK BAD, CHK. SWITCH/COIL',
    'ER. SNGLE DRP. BAD, CHK. SWITCH/COIL',
    'CHECK SWITCH 94, MINI PFD. RIGHT',
    'CHECK SWITCH 95, MINI PFD. LEFT',

  ]
};
