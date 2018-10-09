'use strict';

module.exports = {
  name: 'No Fear',
  version: 'L-8',
  rom: {
    u06: 'nofe2_3x.rom',
  },
  switchMapping: [
    { id: 11, name: 'BALL LAUNCH' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOTTER LANE' },
    { id: 16, name: 'SPINNER' },
    { id: 17, name: 'RIGHT OUTLANE' },
    { id: 18, name: 'RIGHT RETURN' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY EXTRA BALL' },
    { id: 25, name: 'KICKBACK' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'LEFT SLINGSHOT' },
    { id: 28, name: 'RIGHT SLINGSHOT' },

    { id: 31, name: 'TROUGH STACK' },
    { id: 32, name: 'TROUGH 1 (RIGHT)' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 37, name: 'CENTER TR ENTR' },
    { id: 38, name: 'LEFT TR ENTER' },

    { id: 41, name: 'RIGHT POPPER 1' },
    { id: 42, name: 'RIGHT POPPER 2' },
    { id: 46, name: 'LEFT MAGNET' },
    { id: 47, name: 'CENTER MAGNET' },
    { id: 48, name: 'RIGHT MAGNET' },

    { id: 51, name: 'DROP TARGET' },
    { id: 54, name: 'LEFT WIREFORM' },
    { id: 55, name: 'INNER LOOP' },
    { id: 56, name: 'LIGHT KB BOTTOM' },
    { id: 57, name: 'LIGHT KB TOP' },
    { id: 58, name: 'RIGHT LOOP' },

    { id: 61, name: 'EJECT HOLE' },
    { id: 62, name: 'LEFT LOOP' },
    { id: 63, name: 'LEFT RAMP ENTER' },
    { id: 64, name: 'LEFT RMP MIDDLE' },
    { id: 66, name: 'RIGHT RMP ENTER' },
    { id: 67, name: 'RIGHT RAMP EXIT' },

    { id: 71, name: 'RIGHT BANK TOP' },
    { id: 72, name: 'RIGHT BANK MID' },
    { id: 73, name: 'RIGHT BANK BOT' },
    { id: 74, name: 'L TROLL UP' },
    { id: 75, name: 'R TROLL UP' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  skipWmcRomCheck: true,
  features: [
    'securityPic',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES 32, 33, 34, 35, 
      31, 37, 38, 41, 42, 46, 47, 48,
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
