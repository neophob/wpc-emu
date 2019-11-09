'use strict';

module.exports = {
  name: 'WPC-S: The Flintstones',
  version: 'LX-5',
  pinmame: {
    knownNames: [ 'fs_lx2', 'fs_dx2', 'fs_sp2', 'fs_sp2d', 'fs_lx4', 'fs_dx4', 'fs_lx5', 'fs_dx5' ],
    gameName: 'Flintstones, The',
    id: 'fs',
  },
  rom: {
    u06: 'flin_lx5.rom',
  },
  switchMapping: [
    { id: 11, name: 'LAUNCH BUTTON' },
    { id: 12, name: 'TICKET DISP' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'RT. SHOOTER LANE' },
    { id: 16, name: 'LFT. BOWLING TGT' },
    { id: 17, name: 'CNT. BOWLING TGT' },
    { id: 18, name: 'RGT. BOWLING TGT' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY IN' },
    { id: 25, name: 'MACHINE EXIT' },
    { id: 26, name: 'UP LFT HALF TGT' },
    { id: 27, name: 'LEFT LANE EXIT' },
    { id: 28, name: 'LFT LOOP ENTER' },

    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 36, name: 'TOP POPPER' },
    { id: 37, name: 'RGHT RMP ENTER' },
    { id: 38, name: 'LFT RMP ENTER' },

    { id: 41, name: 'BED<R>OCK' },
    { id: 42, name: 'BEDR<O>CK' },
    { id: 43, name: 'BEDRO<C>K' },
    { id: 44, name: 'BEDROC<K>' },
    { id: 45, name: 'BE<D>ROCK' },
    { id: 46, name: 'B<E>DROCK' },
    { id: 47, name: '<B>EDROCK' },
    { id: 48, name: 'CENTER LANE EXIT' },

    { id: 51, name: 'LFT RGHT TGT 3' },
    { id: 52, name: 'LFT RGHT TGT 2' },
    { id: 53, name: 'LFT RGHT TGT 1' },
    { id: 54, name: 'LEFT HALF TGT' },
    { id: 55, name: 'RIGHT HALF TGT' },
    { id: 56, name: 'DICTABIRD TARGET' },

    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGHT SLING' },
    { id: 63, name: 'LEFT BUMPER' },
    { id: 64, name: 'RIGHT BUMPER' },
    { id: 65, name: 'BOTM BUMPER' },
    { id: 66, name: '<D>IG' },
    { id: 67, name: 'D<I>G' },
    { id: 68, name: 'DI<G>' },

    { id: 71, name: 'LEFT OUTLANE' },
    { id: 72, name: 'LFT RET LANE' },
    { id: 73, name: 'RGT RET LANE' },
    { id: 74, name: 'RIGHT OUTLANE' },
    { id: 75, name: 'RIGHT LANE EXIT' },
    { id: 76, name: 'MACHINE ENTER' },
    { id: 77, name: 'RIGHT RAMP EXIT' },
    { id: 78, name: 'LEFT RAMP EXIT' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-flintstones.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 41, 42, 43
      31, 41, 42, 43,
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
