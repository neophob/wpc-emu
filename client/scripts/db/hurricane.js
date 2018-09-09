'use strict';

module.exports = {
  name: 'Hurricane',
  version: 'L-2',
  rom: {
    u06: 'https://s3-eu-west-1.amazonaws.com/foo-temp/hurcnl_2.rom',
    u14: 'https://s3-eu-west-1.amazonaws.com/foo-temp/U14.PP',
    u15: 'https://s3-eu-west-1.amazonaws.com/foo-temp/U15.PP',
    u18: 'https://s3-eu-west-1.amazonaws.com/foo-temp/U18.PP',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT FLIPPER' },
    { id: 12, name: 'LEFT FLIPPER' },
    { id: 13, name: 'CREDIT BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'OUTHOLE' },
    { id: 16, name: 'TROUGH 1' },
    { id: 17, name: 'TROUGH 2' },
    { id: 18, name: 'TROUGH 3' },
    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'RIGHT SLING' },
    { id: 26, name: 'RIGHT RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'BALL SHOOTER' },
    { id: 31, name: 'FERRIS WHEEL' },
    { id: 33, name: 'L DROP 1' },
    { id: 34, name: 'L DROP 2' },
    { id: 35, name: 'L DROP 3' },
    { id: 36, name: 'LEFT SLING' },
    { id: 37, name: 'LEFT RETURN' },
    { id: 38, name: 'LEFT OUTLANE' },
    { id: 42, name: 'RIGHT STANDUP 1' },
    { id: 43, name: 'RIGHT STANDUP 2' },
    { id: 44, name: 'RIGHT STANDUP 3' },
    { id: 45, name: 'RIGHT STANDUP 4' },
    { id: 51, name: 'LEFT JET' },
    { id: 52, name: 'RIGHT JET' },
    { id: 53, name: 'BOTTOM JET' },
    { id: 55, name: 'DUNK THE DUMMY' },
    { id: 56, name: 'LEFT JUGGLER' },
    { id: 57, name: 'RIGHT JUGGLER' },
    { id: 61, name: 'HURRICANE ENTRY' },
    { id: 62, name: 'HURRICANE EXIT' },
    { id: 63, name: 'COMET ENTRY' },
    { id: 64, name: 'COMET EXIT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'https://s3-eu-west-1.amazonaws.com/foo-temp/playfield-hurricane.jpg',
    lamps: [
      [{ x: 82, y: 312, color: 'YELLOW' }],
      [{ x: 98, y: 312, color: 'YELLOW' }],
      [{ x: 74, y: 325, color: 'ORANGE' }],
      [{ x: 91, y: 322, color: 'RED' }],
      [{ x: 107, y: 325, color: 'ORANGE' }],
      [{ x: 91, y: 338, color: 'RED' }], // CLOWN MOUTH
      [{ x: 10, y: 288, color: 'ORANGE' }], //LEFT OUTLANE
      [{ x: 26, y: 288, color: 'ORANGE' }], // LEFT RETURN LANE

      [{ x: 77, y: 295, color: 'LBLUE' }],
      [{ x: 67, y: 285, color: 'LBLUE' }],
      [{ x: 59, y: 277, color: 'LBLUE' }],
      [{ x: 54, y: 269, color: 'LBLUE' }],
      [{ x: 45, y: 261, color: 'LBLUE' }],
      [{ x: 32, y: 220, color: 'GREEN' }],
      [{ x: 35, y: 208, color: 'GREEN' }],
      [{ x: 37, y: 197, color: 'GREEN' }],

      [{ x: 67, y: 265, color: 'WHITE' }],
      [{ x: 75, y: 272, color: 'WHITE' }],
      [{ x: 85, y: 276, color: 'WHITE' }],
      [{ x: 96, y: 276, color: 'WHITE' }],
      [{ x: 106, y: 272, color: 'WHITE' }],
      [{ x: 113, y: 265, color: 'WHITE' }], //#36,PALACE E
      [{ x: 170, y: 287, color: 'ORANGE' }], //RIGHT OUTLANE
      [{ x: 155, y: 287, color: 'ORANGE' }],

      [{ x: 121, y: 244, color: 'RED' }], //#41, SPECIAL
      [{ x: 124, y: 232, color: 'ORANGE' }],
      [{ x: 127, y: 221, color: 'WHITE' }],
      [{ x: 131, y: 209, color: 'YELLOW' }],
      [{ x: 134, y: 197, color: 'WHITE' }],
      [{ x: 154, y: 108, color: 'YELLOW' }],
      [{ x: 160, y: 99, color: 'YELLOW' }],
      [{ x: 167, y: 108, color: 'YELLOW' }],

      [{ x: 56, y: 167, color: 'GREEN' }],
      [{ x: 55, y: 150, color: 'GREEN' }],
      [{ x: 56, y: 133, color: 'WHITE' }],  //MYSTERY
      [{ x: 62, y: 110, color: 'YELLOW' }], //JACKPOT
      [{ x: 90, y: 371, color: 'ORANGE' }], //#55, PLAY IT AGAIN
      [{ x: 31, y: 165, color: 'WHITE' }],
      [{ x: 60, y: 45, color: 'YELLOW' }], //#57, FERRIS WHEEL - UNKNOWN
      [{ x: 87, y: 184, color: 'WHITE' }],

      [{ x: 79, y: 154, color: 'GREEN' }], //#61
      [{ x: 92, y: 153, color: 'RED' }],
      [{ x: 77, y: 141, color: 'ORANGE' }], //#63
      [{ x: 91, y: 140, color: 'WHITE' }],
      [{ x: 86, y: 92, color: 'BLACK' }],
      [{ x: 127, y: 80, color: 'BLACK' }],
      [{ x: 116, y: 120, color: 'BLACK' }],
      [{ x: 109, y: 188, color: 'LBLUE' }],

      [{ x: 91, y: 247, color: 'YELLOW' }], //#71
      [{ x: 93, y: 233, color: 'YELLOW' }],
      [{ x: 95, y: 217, color: 'YELLOW' }],
      [{ x: 80, y: 214, color: 'WHITE' }],
      [{ x: 153, y: 231, color: 'GREEN' }],
      [{ x: 151, y: 219, color: 'GREEN' }],
      [{ x: 149, y: 207, color: 'GREEN' }],
      [{ x: 147, y: 195, color: 'GREEN' }],

      [{ x: 164, y: 57, color: 'WHITE' }], // #81
      [{ x: 164, y: 30, color: 'WHITE' }],
      [{ x: 189, y: 28, color: 'WHITE' }],
      [{ x: 185, y: 59, color: 'WHITE' }],
      [{ x: 155, y: 359, color: 'WHITE' }, { x: 31, y: 359, color: 'WHITE' }],
      [{ x: 11, y: 389, color: 'YELLOW' }],
      [{ x: 39, y: 298, color: 'YELLOW' }],
      [{ x: 139, y: 298, color: 'YELLOW' }],
    ],
  },    
  skipWmcRomCheck: true,
  initialise: {
    closedSwitches: [ 16, 17, 18 ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  }
};
