'use strict';

module.exports = {
  name: 'Cactus Canyon',
  version: '1.3',
  rom: {
    u06: 'cc_g11.1_3',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'MINE ENTRANCE' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'R RETURN' },
    { id: 18, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 26, name: 'L RETURN' },
    { id: 27, name: 'RIGHT OUTLANE' },
    { id: 28, name: 'R STANDUP (BOT)' },

    { id: 31, name: 'TROUGH EJECT' },
    { id: 32, name: 'TROUGH BALL 1' },
    { id: 33, name: 'TROUGH BALL 2' },
    { id: 34, name: 'TROUGH BALL 3' },
    { id: 35, name: 'TROUGH BALL 4' },
    { id: 36, name: 'L LOOP BOTTOM' },
    { id: 37, name: 'RT LOOP BOTTOM' },

    { id: 41, name: 'MINE POPPER' },
    { id: 42, name: 'SALOON POPPER' },
    { id: 44, name: 'R STANDUP (TOP)' },
    { id: 46, name: 'BEER MUG SWITCH' },
    { id: 47, name: 'L BONUS X LANE' },
    { id: 48, name: 'JET EXIT' },

    { id: 51, name: 'L SLINGSHOT' },
    { id: 52, name: 'R SLINGSHOT' },
    { id: 53, name: 'LEFT JET' },
    { id: 54, name: 'RIGHT JET' },
    { id: 55, name: 'BOTTOM JET' },
    { id: 56, name: 'RIGHT LOOP TOP' },
    { id: 57, name: 'R BONUS X LANE' },
    { id: 58, name: 'LEFT LOOP TOP' },

    { id: 61, name: 'DROP #1 (L)' },
    { id: 62, name: 'DROP #2 (LC)' },
    { id: 63, name: 'DROP #3 (RC)' },
    { id: 64, name: 'DROP #4 (R)' },
    { id: 65, name: 'R RAMP MAKE' },
    { id: 66, name: 'R RAMP ENTER' },
    { id: 67, name: 'SKILL BOWL' },
    { id: 68, name: 'BOT R RAMP' },

    { id: 71, name: 'TRAIN ENCODER' },
    { id: 72, name: 'TRAIN HOME' },
    { id: 73, name: 'SALOON GATE' },
    { id: 75, name: 'SALOON BART TOY' },
    { id: 77, name: 'MINE HOME' },
    { id: 78, name: 'MINE ENCODER' },

    { id: 82, name: 'C RAMP ENTER' },
    { id: 83, name: 'L RAMP MAKE' },
    { id: 84, name: 'C RAMP MAKE' },
    { id: 85, name: 'L RAMP ENTER' },
    { id: 86, name: 'L STANDUP (TOP)' },
    { id: 87, name: 'L STANDUP (BOT)' },
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
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 41, 42
      31, 41, 42,
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
