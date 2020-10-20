'use strict';

module.exports = {
  name: 'WPC-DCS: Demolition Man',
  version: 'LX-4',
  pinmame: {
    knownNames: [
      'dm_pa2', 'dm_pa3', 'dm_px5', 'dm_px6', 'dm_la1', 'dm_da1', 'dm_lx3', 'dm_dx3', 'dm_lx4', 'dm_dx4', 'dm_lx4c',
      'dm_h5', 'dm_h5b', 'dm_h5c', 'dm_dh5', 'dm_dh5b', 'dm_h6', 'dm_h6b', 'dm_h6c',
    ],
    gameName: 'Demolition Man',
    id: 'dm',
  },
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
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-dm.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcDcs',
  ],
  cabinetColors: [
    '#72BAF6',
    '#F4D7AD',
    '#E8BE42',
    '#BBBDBE',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 25, 26, 31, 32, 33, 34, 35, 36, 67, 71, 72, 73, 74, 76
      25, 26, 36, 67, 71, 72, 73, 74, 76,
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
        offset: 0x1B9E,
        value: 0x01,
      },
    ],
  },
  memoryPosition: {
    checksum: [
      { dataStartOffset: 0x1C61, dataEndOffset: 0x1C84, checksumOffset: 0x1C85, checksum: '16bit', name: 'HI_SCORE' },
      { dataStartOffset: 0x1C87, dataEndOffset: 0x1C8F, checksumOffset: 0x1C90, checksum: '16bit', name: 'CHAMPION' },
      { dataStartOffset: 0x1B20, dataEndOffset: 0x1BF8, checksumOffset: 0x1BF9, checksum: '16bit', name: 'ADJUSTMENT' },
    ],
    knownValues: [
      { offset: 0x86, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },

      { offset: 0x418, name: 'GAME_PLAYER_CURRENT', description: 'if pinball starts, current player is set to 1, maximal 4', type: 'uint8' },
      { offset: 0x419, name: 'GAME_BALL_CURRENT', description: 'if pinball starts, current ball is set to 1, maximal 4', type: 'uint8' },

      { offset: 0x4A3, name: 'GAME_CURRENT_SCREEN', description: '0: attract mode, 0x80: tilt warning, 0x89: shows tournament enable screen, 0xF1: coin door open/add more credits, 0xF4: switch scanning', type: 'uint8' },

      { offset: 0x1730, name: 'GAME_SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 6 },
      { offset: 0x1737, name: 'GAME_SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 6 },
      { offset: 0x173E, name: 'GAME_SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 6 },
      { offset: 0x1745, name: 'GAME_SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 6 },

      { offset: 0x17A9, name: 'GAME_PLAYER_TOTAL', description: '1-4 players', type: 'uint8' },

      { offset: 0x180C, name: 'STAT_GAME_ID', type: 'string' },
      { offset: 0x1883, name: 'STAT_GAMES_STARTED', type: 'uint8', length: 3 },
      { offset: 0x1889, name: 'STAT_TOTAL_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x188F, name: 'STAT_TOTAL_FREE_PLAYS', type: 'uint8', length: 3 },
      { offset: 0x18BF, name: 'STAT_MINUTES_ON', description: 'Minutes powered on', type: 'uint8', length: 3 },
      { offset: 0x18B9, name: 'STAT_PLAYTIME', description: 'Minutes playing', type: 'uint8', length: 5 },
      { offset: 0x18C5, name: 'STAT_BALLS_PLAYED', type: 'uint8', length: 3 },
      { offset: 0x18CB, name: 'STAT_TILT_COUNTER', type: 'uint8', length: 5 },
      { offset: 0x18E9, name: 'STAT_1_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18EF, name: 'STAT_2_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18F5, name: 'STAT_3_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },
      { offset: 0x18FB, name: 'STAT_4_PLAYER_GAME', description: 'Counts finished games', type: 'uint8', length: 3 },

      { offset: 0x1913, name: 'STAT_LEFT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x1919, name: 'STAT_RIGHT_DRAIN', type: 'uint8', length: 3 },
      { offset: 0x19FD, name: 'STAT_LEFT_FLIPPER_TRIG', type: 'uint8', length: 3 },
      { offset: 0x1A03, name: 'STAT_RIGHT_FLIPPER_TRIG', type: 'uint8', length: 3 },

      { offset: 0x1B20, name: 'GAME_BALL_TOTAL', description: 'Balls per game', type: 'uint8' },
      { offset: 0x1B9E, name: 'STAT_FREEPLAY', description: '0: not free, 1: free', type: 'uint8' },

      { offset: 0x1C61, name: 'HISCORE_1_NAME', type: 'string' },
      { offset: 0x1C64, name: 'HISCORE_1_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C6A, name: 'HISCORE_2_NAME', type: 'string' },
      { offset: 0x1C6D, name: 'HISCORE_2_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C73, name: 'HISCORE_3_NAME', type: 'string' },
      { offset: 0x1C76, name: 'HISCORE_3_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C7C, name: 'HISCORE_4_NAME', type: 'string' },
      { offset: 0x1C7F, name: 'HISCORE_4_SCORE', type: 'bcd', length: 6 },
      { offset: 0x1C87, name: 'HISCORE_CHAMP_NAME', description: 'Grand Champion', type: 'string' },
      { offset: 0x1C8A, name: 'HISCORE_CHAMP_SCORE', description: 'Grand Champion', type: 'bcd', length: 6 },

      { offset: 0x1C98, name: 'GAME_CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
      { offset: 0x1C99, name: 'GAME_CREDITS_HALF', description: '0: no half credits', type: 'uint8' },
    ]
  },
};
