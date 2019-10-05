'use strict';

module.exports = {
  name: 'WPC-ALPHA: Funhouse',
  version: 'L-9',
  rom: {
    u06: 'funh_l9.rom',
  },
  switchMapping: [
    { id: 11, name: 'RIGHT FLIPPER' },
    { id: 12, name: 'LEFT FLIPPER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'STEPS LIGHTS FRENZY' },
    { id: 16, name: 'UPPER RAMP SWITCH' },
    { id: 17, name: 'S-T-E-P "S"' },
    { id: 18, name: 'UPPER LEFT JET BUMPER' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'FRONT DOOR' },
    { id: 25, name: 'LOCK MECH RIGHT' },
    { id: 26, name: 'STEPS LIGHTS EXTRA BALL' },
    { id: 27, name: 'LOCK MECH CENTER' },
    { id: 28, name: 'LOCK MECH LEFT' },

    { id: 31, name: 'S-T-E-P "P"' },
    { id: 32, name: 'TOP SUPERDOG STANDUP TARGET' },
    { id: 33, name: 'UPPER LEFT GANGWAY ROLLUNDER' },
    { id: 34, name: 'BOTTOM SUPERDOG STANDUP TARGET' },
    { id: 35, name: 'STEPS TRACK LOWER' },
    { id: 36, name: 'STEPS 500,000' },
    { id: 37, name: 'CENTER SUPERDOG STANDUP TARGET' },
    { id: 38, name: 'STEPS TRACK UPPER' },

    { id: 41, name: 'LEFT SLINGSHOT (KICKER)' },
    { id: 42, name: 'LEFT FLIPPER RETURN LANE' },
    { id: 43, name: 'LEFT OUTLANE' },
    { id: 44, name: 'WIND TUNNEL HOLE' },
    { id: 45, name: 'TRAP DOOR' },
    { id: 46, name: 'RUDYS HIDEOUT KICKBIG' },
    { id: 47, name: 'LEFT BALL SHOOTER' },
    { id: 48, name: 'RAMP EXIT TRACK' },

    { id: 51, name: 'DUMMY JAW' },
    { id: 52, name: 'RIGHT OUTLANE' },
    { id: 53, name: 'RIGHT SLINGSHOOT (KICKER)' },
    { id: 54, name: 'S-T-E-P "T"' },
    { id: 55, name: 'STEPS SUPERDOG' },
    { id: 56, name: 'RAMPS ENTRANCE' },
    { id: 57, name: 'JET BUMPER LANE' },
    { id: 58, name: 'TUNNEL KICKOUT' },

    { id: 61, name: 'RT INSIDE FLIPPER RETURN LANE' },
    { id: 62, name: 'RIGHT BALL SHOOTER' },
    { id: 63, name: 'RIGHT TROUGH' },
    { id: 64, name: 'S-T-E-P "E"' },
    { id: 65, name: 'DUMMY EJECT HOLE' },
    { id: 66, name: 'UPPER RIGHT GANGWAY LANE' },
    { id: 67, name: 'LOWER RIGHT DROP HOLE' },
    { id: 68, name: 'LOWER JET BUMPER' },

    { id: 71, name: 'RT OUTSIDE FLIPPER RETURN LANE' },
    { id: 72, name: 'LEFT TROUGH' },
    { id: 73, name: 'OUTHOLE' },
    { id: 74, name: 'CENTER TROUGH' },
    { id: 75, name: 'UPPER RIGHT LOOP SWITCH' },
    { id: 76, name: 'TRAP DOOR CLOSED' },
    { id: 77, name: 'UPPER RIGHT JET BUMPER' },

  ],
  skipWpcRomCheck: true,
  features: [
    'wpcAlphanumeric',
  ],
  initialise: {
    closedSwitches: [
      //OPTO 51, 55
      22,
      51, 55,
      63, 72, 74, 
    ],
    initialAction: [
      {
        delayMs: 1500,
        source: 'cabinetInput',
        value: 16
      },
    ],
  },
  memoryPosition: {
    checksum: [
    ],
    knownValues: [
    ]
  },
};

