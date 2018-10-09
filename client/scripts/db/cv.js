'use strict';

module.exports = {
  name: 'Cirqus Voltaire',
  version: '1.3',
  rom: {
    u06: 'CV_G11.1_3',
  },
  switchMapping: [
    { id: 11, name: 'BACK BOX LUCK' },
    { id: 12, name: 'WIRE RAM ENTER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT LOOP UPPER' },
    { id: 16, name: 'TOP EDDY' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'RIGHT LOOP UPPER' },
    { id: 25, name: 'INNER LOOP LEFT' },
    { id: 26, name: 'LEFT INLANE' },
    { id: 27, name: 'LEFT OUTLANE' },
    { id: 28, name: 'INNER LOOP RIGHT' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'POPPER OPTO' },
    { id: 37, name: 'WOW TARGET' },
    { id: 38, name: 'TOP TARGETS' },

    { id: 41, name: 'LEFT LANE' },
    { id: 42, name: 'RINGMASTER UP' },
    { id: 43, name: 'RINGMASTER MID' },
    { id: 44, name: 'RINGMASTER DOWN' },
    { id: 45, name: 'LEFT RAMP MADE' },
    { id: 46, name: 'TROUGH UPPER' },
    { id: 47, name: 'TROUGH MIDDLE' },
    { id: 48, name: 'LEFT LOOP ENTER' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'UPPER JET' },
    { id: 54, name: 'MIDDLE JET' },
    { id: 55, name: 'LOWER JET' },
    { id: 56, name: 'SKILL SHOT' },
    { id: 57, name: 'RIGHT OUTLANE' },
    { id: 58, name: 'RING N,G' },

    { id: 61, name: 'LIGHT STANDUP' },
    { id: 62, name: 'LOCK STANDUP' },
    { id: 63, name: 'RAMP ENTER' },
    { id: 64, name: 'RAMP MAGNET' },
    { id: 65, name: 'RAMP MADE' },
    { id: 66, name: 'RAMP LOCK LOW' },
    { id: 67, name: 'RAMP LOCK MID' },
    { id: 68, name: 'RAMP LOCK HIGH' },

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
