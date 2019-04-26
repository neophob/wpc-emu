'use strict';

module.exports = {
  name: 'WPC-95: Ticket Tac Toe (Redemption game)',
  version: '1.0',
  rom: {
    u06: 'TIKT1_0.ROM',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 16, name: 'RIGHT SLING' },
    { id: 17, name: 'RIGHT POST' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 26, name: 'LEFT POST' },
    { id: 27, name: 'LEFT SLING' },

    { id: 31, name: 'HOLE "9"' },
    { id: 32, name: 'HOLE "8"' },
    { id: 33, name: 'HOLE "7"' },
    { id: 34, name: 'HOLE "6"' },
    { id: 35, name: 'HOLE "5"' },
    { id: 36, name: 'KICKER OPTO' },

    { id: 41, name: 'HOLE "4"' },
    { id: 42, name: 'HOLE "3"' },
    { id: 43, name: 'HOLE "2"' },
    { id: 44, name: 'HOLE "1"' },

    { id: 51, name: 'TICKET OPTO' },
    { id: 52, name: 'TICKETS LOW' },
    { id: 53, name: 'TICKET TEST' },
    { id: 54, name: 'SWITCH 54' },
    { id: 55, name: 'SWITCH 55' },
    { id: 56, name: 'SWITCH 56' },
    { id: 57, name: 'SWITCH 57' },
    { id: 58, name: 'SWITCH 58' },

    { id: 61, name: 'SWITCH 61' },
    { id: 62, name: 'SWITCH 62' },
    { id: 63, name: 'SWITCH 63' },
    { id: 64, name: 'SWITCH 64' },
    { id: 65, name: 'SWITCH 65' },
    { id: 66, name: 'SWITCH 66' },
    { id: 67, name: 'SWITCH 67' },
    { id: 68, name: 'SWITCH 68' },

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
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpc95',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 41, 42, 43, 44, 51
      31, 32, 33, 34, 35, 41, 42, 43, 44,
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
