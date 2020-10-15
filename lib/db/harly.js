'use strict';

module.exports = {
  name: 'WPC-ALPHA: Harley Davidson',
  version: 'L-3',
  pinmame: {
    knownNames: [ 'hd_l1', 'hd_d1', 'hd_l2', 'hd_d2', 'hd_l3', 'hd_d3' ],
    gameName: 'Harley-Davidson',
    id: 'hd',
  },
  rom: {
    u06: 'HARLY_L3.ROM',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT FLIPPER' },
    { id: 12, name: 'LEFT FLIPPER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'OUTHOLE' },
    { id: 16, name: 'TROUGH 1' },
    { id: 17, name: 'TROUGH 2' },
    { id: 18, name: 'TROUGH 3' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'FRONT DOOR' },
    { id: 23, name: 'TOKEN DISPENSER' },
    { id: 25, name: 'LEFT JET BUMPER' },
    { id: 26, name: 'RIGHT JET BUMPER' },
    { id: 27, name: 'LOWER JET BUMPER' },
    { id: 28, name: 'LOWER RIGHT EJECT' },

    { id: 31, name: 'B IN BIKE' },
    { id: 32, name: 'I IN BIKE' },
    { id: 33, name: 'K IN BIKE' },
    { id: 34, name: 'E IN BIKE' },
    { id: 35, name: 'TOP RIGHT EJECT' },
    { id: 36, name: 'TOP LEFT EJECT' },
    { id: 37, name: 'LEFT SLING' },
    { id: 38, name: 'RIGHT SLING' },

    { id: 41, name: 'U TOP LANE' },
    { id: 42, name: 'S TOP LANE' },
    { id: 43, name: 'A TOP LANE' },

    { id: 51, name: 'H IN HARLEY' },
    { id: 52, name: 'A IN HARLEY' },
    { id: 53, name: 'R IN HARLEY' },
    { id: 54, name: 'L IN HARLEY' },
    { id: 55, name: 'E IN HARLEY' },
    { id: 56, name: 'Y IN HARLEY' },
    { id: 57, name: '1ST D IN DAVIDSON' },
    { id: 58, name: 'A IN DAVIDSON' },

    { id: 61, name: 'V IN DAVIDSON' },
    { id: 62, name: 'I IN DAVIDSON' },
    { id: 63, name: '2ND D IN DAVIDSON' },
    { id: 64, name: 'S IN DAVIDSON' },
    { id: 65, name: 'O IN DAVIDSON' },
    { id: 66, name: 'N IN DAVIDSON' },
    { id: 67, name: 'RIGHT SPINNER' },
    { id: 68, name: 'LEFT SPINNER' },

    { id: 71, name: 'LEFT LOOP' },
    { id: 72, name: 'RIGHT LOOP' },
    { id: 73, name: 'LEFT DRAIN' },
    { id: 74, name: 'RIGHT DRAIN' },
    { id: 75, name: 'SHOOTER LANE' },

  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-hd.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcAlphanumeric',
  ],
  cabinetColors: [
    '#44A1DF',
    '#D4914A',
  ],
  initialise: {
    closedSwitches: [
      16, 17, 18,
      22,
    ],
    initialAction: [
      {
        delayMs: 1500,
        source: 'cabinetInput',
        value: 16
      },
    ],
  },
  memoryPosition: {
    checksum: [
    ],
    knownValues: [
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

    ]
  }
};

