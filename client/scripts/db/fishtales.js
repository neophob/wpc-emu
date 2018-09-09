'use strict';

module.exports = {
  name: 'Fish Tales',
  version: 'P-4',
  rom: {
    u06: 'https://s3-eu-west-1.amazonaws.com/foo-temp/ft_p4.u6',
    u14: 'https://s3-eu-west-1.amazonaws.com/foo-temp/t2_u14.l3',
    u15: 'https://s3-eu-west-1.amazonaws.com/foo-temp/t2_u15.l3',
    u18: 'https://s3-eu-west-1.amazonaws.com/foo-temp/t2_u18.l3',
  },
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'https://s3-eu-west-1.amazonaws.com/foo-temp/playfield-ft.jpg',
  },
  switchMapping: [
    { id: 13, name: 'CREDIT BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'OUTHOLE' },
    { id: 16, name: 'TROUGH 1' },
    { id: 17, name: 'TROUGH 2' },
    { id: 18, name: 'TROUGH 3' },
    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'LEFT OUTLANE' },
    { id: 26, name: 'LEFT RETURN LANE' },
    { id: 27, name: 'LEFT STANDUP 1' },
    { id: 28, name: 'LEFT STANDUP 2' },
    { id: 31, name: 'CAST' },
    { id: 32, name: 'LEFT BOAT EXIT' },
    { id: 33, name: 'RIGHT BOAT EXIT' },
    { id: 34, name: 'SPINNER' },
    { id: 35, name: 'REEL ENTRY' },
    { id: 36, name: 'CATAPULT' },
    { id: 37, name: 'REEL 1 OPTO' },
    { id: 38, name: 'REEL 2 OPTO' },
    { id: 41, name: 'CAPTIVE BALL' },
    { id: 42, name: 'RIGHT BOAT ENTRY' },
    { id: 43, name: 'LEFT BOAT ENTRY' },
    { id: 44, name: 'LIE E' },
    { id: 45, name: 'LIE I' },
    { id: 46, name: 'LIE L' },
    { id: 47, name: 'BALL POPPER' },
    { id: 48, name: 'DROP TARGET' },
    { id: 51, name: 'LEFT JET' },
    { id: 52, name: 'CENTER JET' },
    { id: 53, name: 'RIGHT JET' },
    { id: 54, name: 'RIGHT STANDUP 1' },
    { id: 55, name: 'RIGHT STANDUP 2' },
    { id: 56, name: 'BALL SHOOTER' },
    { id: 57, name: 'LEFT SLING' },
    { id: 58, name: 'RIGHT SLING' },
    { id: 61, name: 'EXTRA BALL' },
    { id: 62, name: 'TOP RIGHT LOOP' },
    { id: 63, name: 'TOP EJECT HOLE' },
    { id: 64, name: 'TOP LEFT LOOP' },
    { id: 65, name: 'RIGHT RETURN' },
    { id: 66, name: 'RIGHT OUTLANE' },
    //TODO support
    /*
    { id: F1, name: 'R FLIPPER EOS' },
    { id: F2, name: 'R FLIPPER BUTTON' },
    { id: F3, name: 'L FLIPPER EOS' },
    { id: F4, name: 'L FLIPPER BUTTON' },
    */
  ],
  skipWmcRomCheck: true,
  initialise: {
    closedSwitches: [ 15, 16, 17, 18 ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  }
};