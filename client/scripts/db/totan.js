'use strict';

module.exports = {
  name: 'WPC-95: Tales of the Arabian Nights',
  version: '1.4',
  rom: {
    u06: 'an_g11.1_4',
  },
  switchMapping: [
    { id: 11, name: 'HAREM PASSAGE' },
    { id: 12, name: 'VANISH TUNNEL' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RAMP ENTER' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'BALL SHOOTER' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'GENIE STANDUP' },
    { id: 25, name: 'BAZAAR EJECT' },
    { id: 26, name: 'LEFT INLANE' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'LEFT WIRE MAKE' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'LEFT CAGE OPTO' },
    { id: 37, name: 'RIGHT CAGE OPTO' },
    { id: 38, name: 'LEFT EJECT' },

    { id: 41, name: 'RAMP MADE LEFT' },
    { id: 42, name: 'GENIE TARGET' },
    { id: 43, name: 'LEFT LOOP' },
    { id: 44, name: 'INNER LOOP LEFT' },
    { id: 45, name: 'INNER LOOP RGT' },
    { id: 46, name: 'MINI STANDUPS' },
    { id: 47, name: 'RAMP MADE RGT' },
    { id: 48, name: 'RGT CAPTIVE BALL' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'LEFT JET' },
    { id: 54, name: 'RIGHT JET' },
    { id: 55, name: 'MIDDLE JET' },
    { id: 56, name: 'LAMP SPIN CCW' },
    { id: 57, name: 'LAMP SPIN CW' },
    { id: 58, name: 'LFT CAPTIVE BALL' },

    { id: 61, name: 'LEFT STANDUPS' },
    { id: 62, name: 'RIGHT STANDUPS' },
    { id: 63, name: 'TOP SKILL' },
    { id: 64, name: 'MIDDLE SKILL' },
    { id: 65, name: 'BOTTOM SKILL' },
    { id: 66, name: 'LOCK 1 (BOT)' },
    { id: 67, name: 'LOCK 2' },
    { id: 68, name: 'LOCK 3 (TOP)' },
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
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37,
      31, 36, 37,
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
