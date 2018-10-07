'use strict';

module.exports = {
  name: 'Cirqus Voltaire',
  version: '1.3',
  rom: {
    u06: 'CV_G11.1_3',
  },
  switchMapping: [
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  skipWmcRomCheck: true,
  features: [
    'securityPic',
  ],
  initialise: {
    closedSwitches: [  ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  }
};
