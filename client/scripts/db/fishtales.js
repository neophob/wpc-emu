'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Fish Tales',
  version: 'L-5',
  rom: {
    u06: 'FSHTL_5.ROM',
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
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-ft.jpg',
    lamps: [
      [{ x: 93, y: 165, color: 'WHITE' }], //11
      [{ x: 93, y: 155, color: 'GREEN' }],
      [{ x: 93, y: 145, color: 'LBLUE' }],
      [{ x: 93, y: 135, color: 'ORANGE' }],
      [{ x: 93, y: 125, color: 'RED' }],
      [{ x: 102, y: 25, color: 'YELLOW' }],
      [{ x: 128, y: 23, color: 'YELLOW' }],
      [{ x: 151, y: 25, color: 'YELLOW' }],

      [{ x: 66, y: 260, color: 'YELLOW' }], //21
      [{ x: 84, y: 268, color: 'YELLOW' }],
      [{ x: 100, y: 268, color: 'YELLOW' }],
      [{ x: 119, y: 260, color: 'YELLOW' }],
      [{ x: 50, y: 172, color: 'LPURPLE' }],
      [{ x: 46, y: 148, color: 'YELLOW' }],
      [{ x: 43, y: 123, color: 'YELLOW' }],
      [{ x: 39, y: 102, color: 'RED' }],

      [{ x: 66, y: 277, color: 'YELLOW' }], //31
      [{ x: 84, y: 280, color: 'YELLOW' }],
      [{ x: 100, y: 280, color: 'YELLOW' }],
      [{ x: 119, y: 277, color: 'YELLOW' }],
      [{ x: 110, y: 160, color: 'GREEN' }],
      [{ x: 110, y: 128, color: 'LPURPLE' }],
      [{ x: 77, y: 160, color: 'GREEN' }],
      [{ x: 77, y: 128, color: 'LPURPLE' }],

      [{ x: 75, y: 300, color: 'GREEN' }], //41
      [{ x: 92, y: 300, color: 'GREEN' }],
      [{ x: 92, y: 347, color: 'ORANGE' }],
      [{ x: 107, y: 300, color: 'GREEN' }],
      [{ x: 56, y: 225, color: 'GREEN' }],
      [{ x: 50, y: 234, color: 'GREEN' }],
      [{ x: 48, y: 246, color: 'GREEN' }],
      [{ x: 15, y: 272, color: 'RED' }, { x: 170, y: 272, color: 'RED' }],

      [{ x: 80, y: 332, color: 'YELLOW' }], //51
      [{ x: 91, y: 329, color: 'YELLOW' }],
      [{ x: 92, y: 313, color: 'GREEN' }],
      [{ x: 103, y: 332, color: 'YELLOW' }],
      [{ x: 152, y: 238, color: 'GREEN' }],
      [{ x: 151, y: 226, color: 'GREEN' }],
      [{ x: 147, y: 212, color: 'GREEN' }],
      [{ x: 28, y: 272, color: 'YELLOW' }],

      [{ x: 61, y: 205, color: 'GREEN' }], //61
      [{ x: 74, y: 209, color: 'GREEN' }],
      [{ x: 86, y: 214, color: 'GREEN' }],
      [{ x: 99, y: 214, color: 'GREEN' }],
      [{ x: 110, y: 209, color: 'GREEN' }],
      [{ x: 123, y: 205, color: 'GREEN' }],
      [{ x: 93, y: 196, color: 'RED' }],
      [{ x: 175, y: 272, color: 'YELLOW' }],

      [{ x: 170, y: 84, color: 'YELLOW' }], //71
      [{ x: 152, y: 155, color: 'RED' }],
      [{ x: 158, y: 138, color: 'GREEN' }],
      [{ x: 161, y: 128, color: 'GREEN' }],
      [{ x: 165, y: 117, color: 'GREEN' }],
      [{ x: 168, y: 172, color: 'LPURPLE' }],
      [{ x: 175, y: 151, color: 'RED' }],
      [{ x: 148, y: 121, color: 'ORANGE' }],

      [{ x: 15, y: 60, color: 'YELLOW' }], //81
      [{ x: 15, y: 52, color: 'YELLOW' }],
      [{ x: 15, y: 44, color: 'YELLOW' }],
      [{ x: 15, y: 36, color: 'YELLOW' }],
      [{ x: 15, y: 28, color: 'YELLOW' }],
      [{ x: 0, y: 0, color: 'BLACK' }],
      [{ x: 189, y: 395, color: 'YELLOW' }],
      [{ x: 33, y: 391, color: 'YELLOW' }],
    ],
    flashlamps: [
      { id: 17, x: 38, y: 101 },
      { id: 18, x: 93, y: 196 },
      { id: 19, x: 93, y: 125 },
      { id: 20, x: 93, y: 135 },
      { id: 21, x: 93, y: 145 },
      { id: 22, x: 93, y: 155 },
      { id: 23, x: 93, y: 165 },
      { id: 25, x: 31, y: 153 },
      { id: 26, x: 24, y: 92 }, { id: 26, x: 62, y: 49, },
      { id: 27, x: 168, y: 109 },
      { id: 28, x: 20, y: 180 },
    ],
  },
  skipWmcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  initialise: {
    closedSwitches: [
      15, 16, 17, 18,
      22,
      37, 38,
      'F2', 'F4',
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  }
};
