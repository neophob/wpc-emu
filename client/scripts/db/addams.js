'use strict';

module.exports = {
  name: 'WPC-Fliptronics: The Addams Family Special',
  version: 'LA-3',
  pinmame: {
    knownNames: [ 'tafg_h3', 'tafg_i3', 'tafg_lx3', 'tafg_dx3', 'tafg_la2', 'tafg_da2', 'tafg_la3', 'tafg_da3' ],
    gamename: 'Addams Family Special Collectors Edition, The',
    id: 'ta',
  },
  rom: {
    u06: 'U6-LA3.ROM',
  },
  switchMapping: [
    { id: 11, name: 'BUY IN' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT TROUGH' },
    { id: 16, name: 'CENTER TROUGH' },
    { id: 17, name: 'RIGHT TROUGH' },
    { id: 18, name: 'OUTHOLE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'RIGHT FLIP LANE' },
    { id: 26, name: 'RIGHT OUTLANE' },
    { id: 27, name: 'BALL SHOOTER' },

    { id: 31, name: 'UPPER LEFT JET' },
    { id: 32, name: 'UPPER RIGHT JET' },
    { id: 33, name: 'CENTER LEFT JET' },
    { id: 34, name: 'CENTER RIGHT JET' },
    { id: 35, name: 'LOWER JET' },
    { id: 36, name: 'LEFT SLINGSHOT' },
    { id: 37, name: 'RIGHT SLINGSHOT' },
    { id: 38, name: 'UPPER LEFT LOOP' },

    { id: 41, name: 'GRAVE "G"' },
    { id: 42, name: 'GRAVE "R"' },
    { id: 43, name: 'CHAIR KICKOUT' },
    { id: 44, name: 'COUSIN IT' },
    { id: 45, name: 'LOWER SWAMP MIL' },
    { id: 47, name: 'CENTER SWAMP MIL' },
    { id: 48, name: 'UPPER SWAMP MIL' },

    { id: 51, name: 'SHOOTER LANE' },
    { id: 53, name: 'BOOKCASE OPTO 1' },
    { id: 54, name: 'BOOKCASE OPTO 2' },
    { id: 55, name: 'BOOKCASE OPTO 3' },
    { id: 56, name: 'BOOKCASE OPTO 4' },
    { id: 57, name: 'BUMPER LANE OPTO' },
    { id: 58, name: 'RIGHT RAMP EXIT' },

    { id: 61, name: 'LEFT RAMP ENTER' },
    { id: 62, name: 'TRAIN WRECK' },
    { id: 63, name: 'THING EJECT LANE' },
    { id: 64, name: 'RIGHT RAMP ENTER' },
    { id: 65, name: 'RIGHT RAMP TOP' },
    { id: 66, name: 'LEFT RAMP TOP' },
    { id: 67, name: 'UPPER RIGHT LOOP' },
    { id: 68, name: 'VAULT' },

    { id: 71, name: 'SWAMP LOCK UPPER' },
    { id: 72, name: 'SWAMP LOCK CENTR' },
    { id: 73, name: 'SWAMP LOCK LOWER' },
    { id: 74, name: 'LOCKUP KICKOUT' },
    { id: 75, name: 'LEFT OUTLANE' },
    { id: 76, name: 'LFT FLIP LANE 2' },
    { id: 77, name: 'THING KICKOUT' },
    { id: 78, name: 'LFT FLIP LANE 1' },

    { id: 81, name: 'BOOKCASE OPEN' },
    { id: 82, name: 'BOOKCASE CLOSED' },
    { id: 84, name: 'THING DOWN OPTO' },
    { id: 85, name: 'THING UP OPTO' },
    { id: 86, name: 'GRAVE "A"' },
    { id: 87, name: 'THING EJECT HOLE' },
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
    image: 'playfield-addams.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  initialise: {
    closedSwitches: [
      15, 16, 17,
      22,
      //OPTO SWITCHES
      53, 54, 55, 56, 57, 84, 85,
      'F2', 'F4', 'F6', 'F8',
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
