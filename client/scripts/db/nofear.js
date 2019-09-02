'use strict';

module.exports = {
  name: 'WPC-S: No Fear',
  version: '2.3X',
  rom: {
    u06: 'nofe2_3x.rom',
  },
  switchMapping: [
    { id: 11, name: 'BALL LAUNCH' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOOTER LANE' },
    { id: 16, name: 'SPINNER' },
    { id: 17, name: 'RIGHT OUTLANE' },
    { id: 18, name: 'RIGHT RETURN' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY EXTRA BALL' },
    { id: 25, name: 'KICKBACK' },
    { id: 26, name: 'LEFT RETURN' },
    { id: 27, name: 'LEFT SLINGSHOT' },
    { id: 28, name: 'RIGHT SLINGSHOT' },

    { id: 31, name: 'TROUGH STACK' },
    { id: 32, name: 'TROUGH 1 (RIGHT)' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 37, name: 'CENTER TR ENTR' },
    { id: 38, name: 'LEFT TR ENTER' },

    { id: 41, name: 'RIGHT POPPER 1' },
    { id: 42, name: 'RIGHT POPPER 2' },
    { id: 46, name: 'LEFT MAGNET' },
    { id: 47, name: 'CENTER MAGNET' },
    { id: 48, name: 'RIGHT MAGNET' },

    { id: 51, name: 'DROP TARGET' },
    { id: 54, name: 'LEFT WIREFORM' },
    { id: 55, name: 'INNER LOOP' },
    { id: 56, name: 'LIGHT KB BOTTOM' },
    { id: 57, name: 'LIGHT KB TOP' },
    { id: 58, name: 'RIGHT LOOP' },

    { id: 61, name: 'EJECT HOLE' },
    { id: 62, name: 'LEFT LOOP' },
    { id: 63, name: 'LEFT RAMP ENTER' },
    { id: 64, name: 'LEFT RMP MIDDLE' },
    { id: 66, name: 'RIGHT RMP ENTER' },
    { id: 67, name: 'RIGHT RAMP EXIT' },

    { id: 71, name: 'RIGHT BANK TOP' },
    { id: 72, name: 'RIGHT BANK MID' },
    { id: 73, name: 'RIGHT BANK BOT' },
    { id: 74, name: 'L TROLL UP' },
    { id: 75, name: 'R TROLL UP' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'UR FLIPPER EOS' },
    { id: 'F6', name: 'UR FLIPPER BUT' },
    { id: 'F8', name: 'UL FLIPPER BUT' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-nf.jpg',
  },
  skipWpcRomCheck: true,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES 31, 32, 33, 34, 35, 37, 38, 41, 42, 46, 47, 48,
      31, 37, 38, 41, 42, 46, 47, 48,
      'F2', 'F4', 'F6', 'F8',
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  },
  memoryPosition: [
    { offset: 0x80, name: 'GAME_RUN', description: '0: not running, 1: running', type: 'uint8' },

    { offset: 0x16A1, name: 'SCORE_P1', description: 'Player 1 Score', type: 'bcd', length: 5 },
    { offset: 0x16A8, name: 'SCORE_P2', description: 'Player 2 Score', type: 'bcd', length: 5 },
    { offset: 0x16AF, name: 'SCORE_P3', description: 'Player 3 Score', type: 'bcd', length: 5 },
    { offset: 0x16B6, name: 'SCORE_P4', description: 'Player 4 Score', type: 'bcd', length: 5 },

    { offset: 0x1CED, name: 'HI_SCORE_1_NAME', type: 'string' },
    { offset: 0x1CF1, name: 'HI_SCORE_1_SCORE', type: 'bcd', length: 5 },
    { offset: 0x1CF6, name: 'HI_SCORE_2_NAME', type: 'string' },
    { offset: 0x1CFA, name: 'HI_SCORE_2_SCORE', type: 'bcd', length: 5 },
    { offset: 0x1CFF, name: 'HI_SCORE_3_NAME', type: 'string' },
    { offset: 0x1D03, name: 'HI_SCORE_3_SCORE', type: 'bcd', length: 5 },
    { offset: 0x1D08, name: 'HI_SCORE_4_NAME', type: 'string' },
    { offset: 0x1D0C, name: 'HI_SCORE_4_SCORE', type: 'bcd', length: 5 },
    { offset: 0x1D13, name: 'CHAMPION_1_NAME', description: 'Grand Champion', type: 'string' },
    { offset: 0x1D17, name: 'CHAMPION_1_SCORE', description: 'Grand Champion', type: 'bcd', length: 5 },

    { offset: 0x1D24, name: 'CREDITS_FULL', description: '0-10 credits', type: 'uint8' },
    { offset: 0x1D25, name: 'CREDITS_HALF', description: '0: no half credits', type: 'uint8' },

  ],
};
