'use strict';

module.exports = {
  name: 'WPC-Fliptronics: Black Rose',
  version: 'L-3',
  rom: {
    u06: 'u6-l3.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'OUTHOLE' },
    { id: 16, name: 'RIGHT TROUGH' },
    { id: 17, name: 'CENTER TROUGH' },
    { id: 18, name: 'LEFT TROUGH' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'SHOOTER' },
    { id: 26, name: 'LEFT OUTLANE' },
    { id: 27, name: 'LEFT RETURN LANE' },
    { id: 28, name: 'LEFT SLINGSHOT' },

    { id: 31, name: 'BOT STANDUPS BOT' },
    { id: 32, name: 'BOT STANDUPS MID' },
    { id: 33, name: 'BOT STANDUPS TOP' },
    { id: 34, name: 'FIRE BUTTON' },
    { id: 35, name: 'CANNON KICKER' },
    { id: 36, name: 'RIGHT OUTLANE' },
    { id: 37, name: 'IGHT RETURN LANE' },
    { id: 38, name: 'RIGHT SLINGSHOT' },

    { id: 41, name: 'MID STANDUPS TOP' },
    { id: 42, name: 'MID STANDUPS MID' },
    { id: 43, name: 'MID STANDUPS BOT' },
    { id: 44, name: 'L RAMP ENTER' },
    { id: 45, name: 'TOP LEFT LOOP' },
    { id: 46, name: 'LEFT JET' },
    { id: 47, name: 'RIGHT JET' },
    { id: 48, name: 'BOTTOM JET' },

    { id: 51, name: 'TOP STANDUPS BOT' },
    { id: 52, name: 'TOP STANDUPS MID' },
    { id: 53, name: 'TOP STANDUPS TOP' },
    { id: 54, name: 'RAMP DOWN' },
    { id: 55, name: 'BALL POPPER' },
    { id: 56, name: 'R RAMP MADE' },
    { id: 57, name: 'JETS EXIT' },
    { id: 58, name: 'JETS ENTER' },

    { id: 61, name: 'SUBWAY TOP' },
    { id: 62, name: 'BACKBOARD RAMP' },
    { id: 63, name: 'LOCKUP 1' },
    { id: 64, name: 'LOCKUP 2' },
    { id: 65, name: 'R SINGLE STANDUP' },
    { id: 66, name: 'SUBWAY BOTTOM' },

    { id: 71, name: 'LOCKUP ENTER' },
    { id: 72, name: 'MIDDLE RAMP' },
    { id: 76, name: 'R RAMP ENTER' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
  ],
  skipWpcRomCheck: true,
  features: [
    'wpcFliptronics',
  ],
  initialise: {
    closedSwitches: [
      22,
      16, 17, 18,
      'F2', 'F4', 'F6',
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
