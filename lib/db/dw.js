'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Dr. Who',
  version: 'L-1',
  pinmame: {
    knownNames: [ 'dw_p5', 'dw_p6', 'dw_l1', 'dw_d1', 'dw_l2', 'dw_d2' ],
    gameName: 'Dr. Who',
    id: 'dw',
  },
  rom: {
    u06: 'drwho_l2.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT SLING' },
    { id: 16, name: 'RIGHT SLING' },
    { id: 17, name: 'SHOOTER LANE' },
    { id: 18, name: 'EXIT JETS' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKET OPTQ' },
    { id: 25, name: 'TROUGH 1 BALL' },
    { id: 26, name: 'TROUGH 2 BALLS' },
    { id: 27, name: 'TROUGH 3 BALLS' },
    { id: 28, name: 'OUTHOLE' },

    { id: 31, name: 'OPTO POPPER' },
    { id: 32, name: 'MINI HOME OPTO' },
    { id: 33, name: 'ENTER TRAMP OPTO' },
    { id: 34, name: 'LAUNCH BALL' },
    { id: 35, name: 'SCORE TOP RAMP' },
    { id: 36, name: 'ENTER BOT RAMP' },
    { id: 37, name: 'SCORE BOT RAMP' },
    { id: 38, name: 'MINI DOOR MID' },

    { id: 41, name: '<E>S-C-A-P-E' },
    { id: 42, name: 'E<S>C-A-P-E' },
    { id: 43, name: 'E-S<C>A-P-E' },
    { id: 44, name: 'E-S-C<A>P-E' },
    { id: 45, name: 'E-S-C-A<P>E' },
    { id: 46, name: 'E-S-C-A-P<E>' },
    { id: 47, name: 'HANGON SCORE' },
    { id: 48, name: 'SELECT DOCTOR' },

    { id: 51, name: '<R>E-P-A-I-R' },
    { id: 52, name: 'R<E>P-A-I-R' },
    { id: 53, name: 'R-E<P>A-I-R' },
    { id: 54, name: 'R-E-P<A>I-R' },
    { id: 55, name: 'R-E-P-A<I>R' },
    { id: 56, name: 'R-E-P-A-I<R>' },
    { id: 57, name: 'TRAP DOOR DOWN' },
    { id: 58, name: 'ACTIVAT TRANSMAT' },

    { id: 61, name: 'LEFT JET' },
    { id: 62, name: 'RIGHT JET' },
    { id: 63, name: 'BOTTOM JET' },
    { id: 64, name: 'LEFT DRAIN' },
    { id: 65, name: 'LEFT RETURN' },
    { id: 66, name: 'RIGHT RETURN' },
    { id: 67, name: 'RIGHT DRAIN' },
    { id: 68, name: 'MINI DOOR LEFT' },

    { id: 71, name: 'MINIOPTO5BANK R1' },
    { id: 72, name: 'MINIOPTO5BANK R2' },
    { id: 73, name: 'MINIOPTO5BANK M' },
    { id: 74, name: 'MINIOPTO5BANK L2' },
    { id: 75, name: 'MINIOPTO5BANK L1' },
    { id: 76, name: 'MINI L OPTOEJECT' },
    { id: 77, name: 'MINI R OPTOEJECT' },
    { id: 78, name: 'MINI LITES LOCK' },

    { id: 82, name: 'PLAYFIELD GLASS' },
    { id: 88, name: 'MINI DOOR RIGHT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-dw.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  cabinetColors: [
    '#F2E24D',
    '#D52F2D',
    '#4480E3',
    '#E2672C',
  ],
  initialise: {
    closedSwitches: [
      22, 25, 26, 27,
      82,
      //OPTO SWITCHES
      31, 32, 33, 71, 72, 73, 74, 75, 76, 77,
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
      { offset: 0x88, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },
      //{ offset: 0x42B, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x1680, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
      { offset: 0x1686, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
      { offset: 0x168C, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
      { offset: 0x1692, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

      { offset: 0x0A0A, name: 'BONUS_MULTIP_P1', description: 'Player 1 Score', type: 'uint8' },
      { offset: 0x0A0B, name: 'BONUS_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },

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

      { offset: 0x1D17, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1D1A, name: 'HISCORE_1_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D1F, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1D22, name: 'HISCORE_2_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D27, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1D2A, name: 'HISCORE_3_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D2F, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1D32, name: 'HISCORE_4_SCORE', type: 'bcd', length: 5 },
      { offset: 0x1D39, name: 'HISCORE_CHAMP_NAME', description: 'Greatest Time Lord', type: 'string' },
      { offset: 0x1D3C, name: 'HISCORE_CHAMP_SCORE', description: 'Greatest Time Lord', type: 'bcd', length: 5 },

    ],
  },
};
