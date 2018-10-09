'use strict';

module.exports = {
  name: 'Indiana Jones: The Pinball Adventure',
  version: 'L-7',
  rom: {
    u06: 'ijone_l7.rom',
  },
  switchMapping: [
    { id: 11, name: 'SINGLE DROP' },
    { id: 12, name: 'BUY-IN BUTTON' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'LEFT OUTLANE' },
    { id: 16, name: 'LEFT RETURN LANE' },
    { id: 17, name: 'RGHT RETURN LANE' },
    { id: 18, name: 'RGHT OUTLANE TOP' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 25, name: '(I)NDY LANE' },
    { id: 26, name: 'I(N)DY LANE' },
    { id: 27, name: 'IN(D)Y LANE' },
    { id: 28, name: 'IND(Y) LANE' },

    { id: 31, name: 'LEFT EJECT' },
    { id: 32, name: 'EXIT IDOL' },
    { id: 33, name: 'LEFT SLINGSHOT' },
    { id: 34, name: 'GUN TRIGGER' },
    { id: 35, name: 'LEFT JET' },
    { id: 36, name: 'RIGHT JET' },
    { id: 37, name: 'BOTTOM JET' },
    { id: 38, name: 'CENTER STANDUP' },

    { id: 41, name: 'LEFT RAMP ENTER' },
    { id: 42, name: 'RIGHT RAMP ENTER' },
    { id: 43, name: 'TOP IDOL ENTER' },
    { id: 44, name: 'RIGHT POPPER' },
    { id: 45, name: 'CENTER ENTER' },
    { id: 46, name: 'TOP POST' },
    { id: 47, name: 'SUBWAY LOOPKUP' },
    { id: 48, name: 'RIGHT SLINGSHOT' },

    { id: 51, name: 'ADVENT(U)RE TRGT' },
    { id: 52, name: 'ADVENTU(R)E TRGT' },
    { id: 53, name: 'ADVENTUR(E) TRGT' },
    { id: 54, name: 'LEFT LOOP TOP' },
    { id: 55, name: 'LEFT LOOP BOTTOM' },
    { id: 56, name: 'RIGHT LOOP TOP' },
    { id: 57, name: 'RIGHT LOOP BOT.' },
    { id: 58, name: 'RGHT OUTLANE BOT' },

    { id: 61, name: '(A)DVENTURE TRGT' },
    { id: 62, name: 'A(D)VENTURE TRGT' },
    { id: 63, name: 'AD(V)ENTURE TRGT' },
    { id: 64, name: 'CAPTVE VALL BACK' },
    { id: 65, name: 'MINI TOP LEFT' },
    { id: 66, name: 'MINI MID TOP LFT' },
    { id: 67, name: 'MINI MID BOT LFT' },
    { id: 68, name: 'MINI COTTOM LEFT' },

    { id: 71, name: 'CAPTVE BALL FRNT' },
    { id: 72, name: 'MINI TOP HOLE' },
    { id: 73, name: 'MINI BOTTOM HOLE' },
    { id: 74, name: 'RIGHT RAMP MADE' },
    { id: 75, name: 'MINI TOP RIGHT' },
    { id: 76, name: 'MINI MID TOP RGT' },
    { id: 77, name: 'MINI MID BOT RGT' },
    { id: 78, name: 'MINI BOTTOM RGT' },

    { id: 81, name: 'TROUGH 6' },
    { id: 82, name: 'TROUGH 5' },
    { id: 83, name: 'TROUGH 4' },
    { id: 84, name: 'TROUGH 3' },
    { id: 85, name: 'TROUGH 2' },
    { id: 86, name: 'TROUGH 1' },
    { id: 87, name: 'TOP TROUGH' },
    { id: 88, name: 'SHOOTER' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'DROP ADV(E)NTURE' },
    { id: 'F6', name: 'DROP ADVE(N)TURE' },
    { id: 'F7', name: 'DROP ADVEN(T)URE' },
    { id: 'F8', name: 'LEFT RAMP MADE' },
  ],
  skipWmcRomCheck: true,
  initialise: {
    closedSwitches: [
      81, 82, 83, 84, 85, 86,
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
