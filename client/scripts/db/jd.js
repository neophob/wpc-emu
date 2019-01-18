'use strict';

module.exports = {
  name: 'WPC-DCS: Judge Dredd',
  version: 'L-7',
  rom: {
    u06: 'jdrd_l7.rom',
  },
  switchMapping: [
    { id: 11, name: 'L FIRE BUTTON' },
    { id: 12, name: 'R FIRE BUTTON' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LFT SHOOT LANE' },
    { id: 16, name: 'LEFT OUTLANE' },
    { id: 17, name: 'LFT RET LANE' },
    { id: 18, name: '3 BANK TGTS' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKET OPTQ' },
    { id: 25, name: 'TOP R POST' },
    { id: 26, name: 'CAP BALL 1' },
    { id: 27, name: 'LOW LFT TARGET' },

    { id: 31, name: 'BUY IN' },
    { id: 33, name: 'TOP CNTR RO' },
    { id: 34, name: 'INSIDE R RET' },
    { id: 35, name: 'SMALL LOOP CNTR' },
    { id: 36, name: 'LEFT SCR POST' },
    { id: 37, name: 'SUBWAY ENTER' },
    { id: 38, name: 'SUBWAY 2' },

    { id: 41, name: 'R BALL SHOOTER' },
    { id: 42, name: 'RIGHT OUTLANE' },
    { id: 43, name: 'OUTSIDE R RET' },
    { id: 44, name: 'SUPER GAME' },

    { id: 51, name: 'LEFT SLING' },
    { id: 52, name: 'RIGHT SLING' },
    { id: 53, name: 'CAP BALL 2' },
    { id: 54, name: '<J>UDGE' },
    { id: 55, name: 'J<U>DGE' },
    { id: 56, name: 'JU<D>GE' },
    { id: 57, name: 'JUD<G>E' },
    { id: 58, name: 'JUDG<E>' },

    { id: 61, name: 'GLOBE POS 1' },
    { id: 62, name: 'GLOBE EXIT' },
    { id: 63, name: 'LFT RMP TO LOCK' },
    { id: 64, name: 'LFT RMP EXIT' },
    { id: 66, name: 'CNTR RMP EXIT' },
    { id: 67, name: 'LEFT RMP ENTER' },
    { id: 68, name: 'CAP BALL 3' },

    { id: 71, name: 'ARM FAR RIGHT' },
    { id: 72, name: 'TOP RGHT OPTO' },
    { id: 73, name: 'LEFT POPPER' },
    { id: 74, name: 'RIGHT POPPER' },
    { id: 75, name: 'TOP R RMP EXIT' },
    { id: 76, name: 'RIGHT RAMP EXIT' },
    { id: 77, name: 'GLOBE POS 2' },

    { id: 81, name: 'TROUGH 6' },
    { id: 82, name: 'TROUGH 5' },
    { id: 83, name: 'TROUGH 4' },
    { id: 84, name: 'TROUGH 3' },
    { id: 85, name: 'TROUGH 2' },
    { id: 86, name: 'TROUGH 1' },
    { id: 87, name: 'TOP TROUGH' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F7', name: 'UL FLIPPER EOS' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-jd.jpg',
  },
  skipWmcRomCheck: true,
  initialise: {
    closedSwitches: [
      //OPTO SWITCHES: 54, 55, 56, 57, 58, 61, 62, 63, 64, 66, 67, 71, 72, 73, 74, 75, 76, 77, 81, 82, 83, 84, 85, 86, 87
      22,
      54, 55, 56, 57, 58, 61, 62, 63, 64, 66, 67, 71, 72, 73, 74, 75, 76, 87,
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
