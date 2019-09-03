'use strict';

module.exports = {
  name: 'WPC-DCS: Demolition Man',
  version: 'LX-4',
  rom: {
    u06: 'dman_lx4.rom',
  },
  switchMapping: [
    { id: 11, name: 'BALL LAUNCH' },
    { id: 12, name: 'L HANDLE BUTTON' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT OUTLANE' },
    { id: 16, name: 'LEFT INLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'RIGHT OUTLANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: 'CLAW RIGHT' },
    { id: 26, name: 'CLAW LEFT' },
    { id: 27, name: 'SHOOTER LANE' },

    { id: 31, name: 'TROUGH 1 (RIGHT)' },
    { id: 32, name: 'TROUGH 2' },
    { id: 33, name: 'TROUGH 3' },
    { id: 34, name: 'TROUGH 4' },
    { id: 35, name: 'TROUGH 5 (LEFT)' },
    { id: 36, name: 'TROUGH JAM' },
    { id: 38, name: 'STANDUP 5' },

    { id: 41, name: 'LEFT SLING' },
    { id: 42, name: 'RIGHT SLING' },
    { id: 43, name: 'LEFT JET' },
    { id: 44, name: 'TOP SLING' },
    { id: 45, name: 'LEFT JET' },
    { id: 46, name: 'R RAMP ENTERPOST' },
    { id: 47, name: 'R RAMP EXIT' },
    { id: 48, name: 'RIGHT LOOP' },

    { id: 51, name: 'L RAMP ENTER' },
    { id: 52, name: 'L RAMP EXIT' },
    { id: 53, name: 'CENTER RAMP' },
    { id: 54, name: 'UPPER REBOUND' },
    { id: 55, name: 'LEFT LOOP' },
    { id: 56, name: 'STANDUP 2' },
    { id: 57, name: 'STANDUP 3' },
    { id: 58, name: 'STANDUP 4' },

    { id: 61, name: 'SIDE RAMP ENTER' },
    { id: 62, name: 'SIDE RAMP EXIT' },
    { id: 63, name: '(M)TL ROLLOVER' },
    { id: 64, name: 'M(T)L ROLLOVER' },
    { id: 65, name: 'MT(L) ROLLOVER' },
    { id: 66, name: 'EJECT' },
    { id: 67, name: 'ELEVATOR INDEX' },

    { id: 71, name: 'CAR CRASH 1' },
    { id: 72, name: 'CAR CRASH 2' },
    { id: 73, name: 'TOP POPPER' },
    { id: 74, name: 'ELEVATOR HOLD' },
    { id: 76, name: 'BOTTOM POPPER' },
    { id: 77, name: 'EYEBALL STANDUP' },
    { id: 78, name: 'STANDUP 1' },

    { id: 81, name: 'CLAW "CAPT SIM"' },
    { id: 82, name: 'CLAW "SUP JETS"' },
    { id: 83, name: 'CLAW "PR BREAK"' },
    { id: 84, name: 'CLAW "FREEZE"' },
    { id: 85, name: 'CLAW "ACMAG"' },
    { id: 86, name: 'UL FLIPPER GATE' },
    { id: 87, name: 'CAR CR STANDUP' },
    { id: 88, name: 'LOWER REBOUND' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-dm.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcDcs',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 25, 26, 31, 32, 33, 34, 35, 36, 67, 71, 72, 73, 74, 76
      25, 26, 36, 67, 71, 72, 73, 74, 76,
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
      { offset: 0x86, name: 'GAME_RUN', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x418, name: 'PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x419, name: 'BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

      { offset: 0x1730, name: 'SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x1737, name: 'SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x173E, name: 'SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x1745, name: 'SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

      { offset: 0x17A9, name: 'PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

      { offset: 0x1B20, name: 'BALL_TOTAL', description: 'Balls per game', type: 'uint8' },

      { offset: 0x1C61, name: 'HI_SCORE_1_NAME', type: 'string' },
      { offset: 0x1C64, name: 'HI_SCORE_1_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C6A, name: 'HI_SCORE_2_NAME', type: 'string' },
      { offset: 0x1C6D, name: 'HI_SCORE_2_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C73, name: 'HI_SCORE_3_NAME', type: 'string' },
      { offset: 0x1C76, name: 'HI_SCORE_3_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C7C, name: 'HI_SCORE_4_NAME', type: 'string' },
      { offset: 0x1C7F, name: 'HI_SCORE_4_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C87, name: 'CHAMPION_1_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1C8A, name: 'CHAMPION_1_SCORE', description: 'Grand Champion', type: 'bcd', length: 6 },

      { offset: 0x1C98, name: 'CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1C99, name: 'CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
    ]
  },
};
