'use strict';

module.exports = {
  name: 'WPC-S: Theatre of Magic',
  version: '1.3X',
  rom: {
    u06: 'tom1_3x.rom',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOOTER LANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY IN' },
    { id: 25, name: 'LEFT OUTLANE' },
    { id: 26, name: 'LEFT RET LANE' },
    { id: 27, name: 'RIGHT RET LANE' },
    { id: 28, name: 'RIGHT OUTLANE' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 36, name: 'SUBWAY OPTO' },
    { id: 37, name: 'SPINNER' },
    { id: 38, name: 'RGT LOWER TGT' },

    { id: 41, name: 'LOCK 1' },
    { id: 42, name: 'LOCK 2' },
    { id: 43, name: 'LOCK 3' },
    { id: 44, name: 'POPPER' },
    { id: 45, name: 'LFT DRAIN EDDY' },
    { id: 47, name: 'SUBWAY MICRO' },
    { id: 48, name: 'RGT DRAIN EDDY' },

    { id: 51, name: 'L BANK TGT' },
    { id: 52, name: 'CAP BALL REST' },
    { id: 53, name: 'R LANE ENTER' },
    { id: 54, name: 'LEFT LANE ENTER' },
    { id: 55, name: 'CUBE POS 4' },
    { id: 56, name: 'CUBE POS 1' },
    { id: 57, name: 'CUBE POS 2' },
    { id: 58, name: 'CUBE POS 3' },

    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGTH SLING' },
    { id: 63, name: 'BOTTOM JET' },
    { id: 64, name: 'MIDDLE JET' },
    { id: 65, name: 'TOP JET' },
    { id: 66, name: 'TOP LANE 1' },
    { id: 67, name: 'TOP LANE 2' },

    { id: 71, name: 'CNTR RAMP EXIT' },
    { id: 73, name: 'R RAMP EXIT' },
    { id: 74, name: 'R RAMP EXIT 2' },
    { id: 75, name: 'CNTR RMP ENTER' },
    { id: 76, name: 'R RAMP ENTER' },
    { id: 77, name: 'CAP BALL TOP' },
    { id: 78, name: 'LOOP LEFT' },

    { id: 81, name: 'LOOP RIGHT' },
    { id: 82, name: 'CNTR RMP TGTS' },
    { id: 83, name: 'VANISH LOCK 1' },
    { id: 84, name: 'VANISH LOCK 2' },
    { id: 85, name: 'TRUNK EDDY' },
    { id: 86, name: 'R LANE EXIT' },
    { id: 87, name: 'LEFT LANE EXIT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-tom.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 55, 56, 57, 58
      36, 55, 56, 57, 58,
      'F2', 'F4',
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
