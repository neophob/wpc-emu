'use strict';

module.exports = {
  name: 'WPC-DCS: Star Trek, The Next Generation',
  version: 'LX-7',
  pinmame: {
    knownNames: [
      'sttng_p4', 'sttng_p5', 'sttng_p6', 'sttng_p8', 'sttng_l1', 'sttng_d1', 'sttng_l2', 'sttng_d2', 'sttng_l3', 'sttng_l7', 'sttng_d7',
      'sttng_l7c', 'sttng_x7', 'sttng_dx', 'sttng_s7', 'sttng_ds', 'sttng_g7', 'sttng_h7' ],
    gamename: 'Star Trek: The Next Generation',
    id: 'sttng',
  },
  rom: {
    u06: 'TREK_LX7.ROM',
  },
  switchMapping: [
    { id: 11, name: 'BUY IN BUTTON' },
    { id: 12, name: 'CONTROL GRIP' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT OUT LANE' },
    { id: 16, name: 'LEFT RET LANE' },
    { id: 17, name: 'RIGHT RET LANE' },
    { id: 18, name: 'RIGHT OUT LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'MADE MID RAMP' },
    { id: 25, name: 'ENTER RIGHT RAMP' },
    { id: 26, name: 'LEFT 45 TARGET' },
    { id: 27, name: 'CENTER 45 TARGET' },
    { id: 28, name: 'RIGHT 45 TARGET' },

    { id: 31, name: 'BORG LOCK' },
    { id: 32, name: 'UNDER LGUN SW2' },
    { id: 33, name: 'UNDER RGUN SW2' },
    { id: 34, name: 'RGHT GUN SHOOTER' },
    { id: 35, name: 'UNDER LLOCK SW2' },
    { id: 36, name: 'UNDER LGUN SW1' },
    { id: 37, name: 'UNDER RGUN SW1' },
    { id: 38, name: 'LEFT GUN SHOOTER' },

    { id: 41, name: 'UNDER LLOCK SW1' },
    { id: 42, name: 'UNDER LLOCK SW3' },
    { id: 43, name: 'UNDER LLOCK SW4' },
    { id: 44, name: 'LEFT OUTER LOOP' },
    { id: 45, name: 'UNDER TOP HOLE' },
    { id: 46, name: 'UNDER LEFT HOLE' },
    { id: 47, name: 'UNDER BORG HOLE' },
    { id: 48, name: 'BORG ENTRY' },

    { id: 51, name: 'LBANK TOP' },
    { id: 52, name: 'LBANK MIDDLE' },
    { id: 53, name: 'LBANK BOTTOM' },
    { id: 54, name: 'RBANK TOP' },
    { id: 55, name: 'RBANK MIDDLE' },
    { id: 56, name: 'RBANK BOTTOM' },
    { id: 57, name: 'TOP DROP TARGET' },
    { id: 58, name: 'RIGHT OUTER LOOP' },

    { id: 61, name: 'TROUGH RL 6' },
    { id: 62, name: 'TROUGH RL 5' },
    { id: 63, name: 'TROUGH RL 4' },
    { id: 64, name: 'TROUGH RL 3' },
    { id: 65, name: 'TROUGH RL 2' },
    { id: 66, name: 'TROUGH RL 1' },
    { id: 67, name: 'TROUGH UP' },
    { id: 68, name: 'SHOOTER' },

    { id: 71, name: 'LEFT JET' },
    { id: 72, name: 'RIGHT JET' },
    { id: 73, name: 'BOTTOM JET' },
    { id: 74, name: 'RIGHT SLING' },
    { id: 75, name: 'LEFT SLING' },
    { id: 76, name: 'TOP LANE LEFT' },
    { id: 77, name: 'TOP LANE CENTER' },
    { id: 78, name: 'TOP LANE RIGHT' },

    { id: 81, name: 'TIME' },
    { id: 82, name: 'RIFT' },
    { id: 83, name: 'MADE LEFT RAMP' },
    { id: 84, name: 'Q' },
    { id: 85, name: 'LEFT 2X SHUTTLE' },
    { id: 86, name: 'RIGHT 2X SHUTTLE' },
    { id: 87, name: 'MADE RIGHT RAMP' },
    { id: 88, name: 'ENTER LEFT RAMP' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'SPINNER' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-sttng.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'wpcDcs',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48
      //               61, 62, 63, 64, 65, 66, 67
      31, 32, 33, 35, 36, 37, 41, 42, 43, 44, 45, 46, 47, 48, 67,
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
