'use strict';

module.exports = {
  name: 'WPC-S: WPC Test Fixture ',
  version: '1.2',
  rom: {
    u06: 'U2_10.ROM',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT FLIPPER' },
    { id: 12, name: 'LEFT FLIPPER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SWITCH 15' },
    { id: 16, name: 'SWITCH 16' },
    { id: 17, name: 'SWITCH 17' },
    { id: 18, name: 'SWITCH 18' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: 'SWITCH 25' },
    { id: 26, name: 'SWITCH 26' },
    { id: 27, name: 'SWITCH 27' },
    { id: 28, name: 'SWITCH 28' },

  ],
  skipWmcRomCheck: false,
  features: [
    'securityPic',
    'wpcSecure',
  ],

};
