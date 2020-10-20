'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Twilight Zone (FreeWPC)',
  version: '1.0',
  pinmame: {
    knownNames: [ 'tz_f100' ],
    gameName: 'Twilight Zone (FreeWPC 1.00)',
    id: 'tz',
  },
  rom: {
    u06: 'ftz1_00.rom',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT INLANE' },
    { id: 12, name: 'RIGHT OUTLANE' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RIGHT TROUGH' },
    { id: 16, name: 'CENTER TROUGH' },
    { id: 17, name: 'LEFT TROUGH' },
    { id: 18, name: 'OUTHOLE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY-IN BUTTON' },
    { id: 25, name: 'FAR L TROUGH' },
    { id: 26, name: 'TROUGH PROXIMITY' },
    { id: 27, name: 'BALL SHOOTER' },
    { id: 28, name: 'ROCKET KICKER' },

    { id: 31, name: 'LEFT JET BUMPER' },
    { id: 32, name: 'RIGHT JET BUMPER' },
    { id: 33, name: 'LOWER JET BUMPER' },
    { id: 34, name: 'LEFT SLINGSHOT' },
    { id: 35, name: 'RIGHT SLINGSHOT' },
    { id: 36, name: 'LEFT OUTLANE' },
    { id: 37, name: 'LEFT INLANE 1' },
    { id: 38, name: 'LEFT INLANE 2' },

    { id: 41, name: 'DEAD END' },
    { id: 42, name: 'THE CAMERA' },
    { id: 43, name: 'PLAYER PIANO' },
    { id: 44, name: 'MINI PF ENTER' },
    { id: 45, name: 'MINI PF LEFT (2)' },
    { id: 46, name: 'MINI PF RGHT (2)' },
    { id: 47, name: 'CLOCK MILLIONS' },
    { id: 48, name: 'LOW LEFT 5 MIL' },

    { id: 51, name: 'GUM POPPER LANE' },
    { id: 52, name: 'HITCH-HIKER' },
    { id: 53, name: 'LEFT RAMP ENTER' },
    { id: 54, name: 'LEFT RAMP' },
    { id: 55, name: 'GUMBALL GENEVA' },
    { id: 56, name: 'GUMBALL EXIT' },
    { id: 57, name: 'SLOT PROXIMITY' },
    { id: 58, name: 'SLOT KICKOUT' },

    { id: 61, name: 'LOWER SKILL' },
    { id: 62, name: 'CENTER SKILL' },
    { id: 63, name: 'UPPER SKILL' },
    { id: 64, name: 'U RIGHT 5 MIL' },
    { id: 65, name: 'POWER PAYLOFF (2)' },
    { id: 66, name: 'MID R 5 MIL 1' },
    { id: 67, name: 'MID R 5 MIL 2' },
    { id: 68, name: 'LOW RIGHT 5 MIL' },

    { id: 72, name: 'AUTO-FIRE KICKER' },
    { id: 73, name: 'RIGHT RAMP' },
    { id: 74, name: 'GUMBALL POPPER' },
    { id: 75, name: 'MINI PF TOP' },
    { id: 76, name: 'MINI PF EXIT' },
    { id: 77, name: 'MID LEFT 5 MIL' },
    { id: 78, name: 'U LEFT 5 MIL' },

    { id: 81, name: 'RIGHT MAGNET' },
    { id: 83, name: 'LEFT MAGNET' },
    { id: 84, name: 'LOCK CENTER' },
    { id: 85, name: 'LOCK UPPER' },
    { id: 87, name: 'GUMBALL ENTER' },
    { id: 88, name: 'LOCK LOWER' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-tz.jpg',
  },
  skipWpcRomCheck: false,
  features: [
    'wpcFliptronics',
  ],
  cabinetColors: [
    '#FCEB4F',
    '#CB322C',
    '#47A5DF',
    '#C27133',
  ],
  initialise: {
    closedSwitches: [
      15, 16, 17,
      22,
      //OPTO SWITCHES:
      71, 72, 73, 74, 75, 76, 81, 82, 83, 84, 85, 86, 87,
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
