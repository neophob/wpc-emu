module.exports = {
  name: 'WPC-S: World Cup Soccer (FreeWPC)',
  version: '0.62',
  pinmame: {
    knownNames: [ 'wcs_f10', 'wcs_f50', 'wcs_f62' ],
    gameName: 'World Cup Soccer (FreeWPC 0.62)',
    id: 'f62',
  },
  rom: {
    u06: 'wcs_f62.rom',
  },
  switchMapping: [
    { id: 12, name: 'MAG GOALIE BUT' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'L FLIPPER LANE' },
    { id: 16, name: 'STRIKER 3 (HIGH)' },
    { id: 17, name: 'R FLIPPER LANE' },
    { id: 18, name: 'RIGHT OUTLANE' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'BUY EXTRA BALL' },
    { id: 25, name: 'FREE KICK TARGET' },
    { id: 26, name: 'KICKBACK UPPER' },
    { id: 27, name: 'SPINNER' },
    { id: 28, name: 'LIGHT KICKBACK' },

    { id: 31, name: 'TROUGH 1 (RIGHT)' },
    { id: 32, name: 'TROUGH 2' },
    { id: 33, name: 'TROUGH 3' },
    { id: 34, name: 'TROUGH 4' },
    { id: 35, name: 'TROUGH 5 (LEFT)' },
    { id: 36, name: 'TROUGH STACK' },
    { id: 37, name: 'LIGHT MAG GOALIE' },
    { id: 38, name: 'BALLSHOOTER' },

    { id: 41, name: 'GOAL TROUGH' },
    { id: 42, name: 'GOAL POPPER OPTO' },
    { id: 43, name: 'GOALIE IS LEFT' },
    { id: 44, name: 'GOALIE IS RIGHT' },
    { id: 45, name: 'TV BALL POPPER' },
    { id: 47, name: 'TRAVEL LANE ROLO' },
    { id: 48, name: 'GOALIE TARGET' },

    { id: 51, name: 'SKILL SHOT FRONT' },
    { id: 52, name: 'SKILL SHOT CENT' },
    { id: 53, name: 'SKILL SHOT REAR' },
    { id: 54, name: 'RIGHT EJECT HOLE' },
    { id: 55, name: 'UPPER EJECT HOLE' },
    { id: 56, name: 'LEFT EJECT HOLE' },
    { id: 57, name: 'R LANE HI-UNUSED' },
    { id: 58, name: 'R LANE LO-UNUSED' },

    { id: 61, name: 'ROLLOVER 1(HIGH)' },
    { id: 62, name: 'ROLLOVER 2' },
    { id: 63, name: 'ROLLOVER 3' },
    { id: 64, name: 'ROLLOVER 4 (LOW)' },
    { id: 65, name: 'TACKLE SWITCH' },
    { id: 66, name: 'STRIKER 1 (LEFT)' },
    { id: 67, name: 'STRIKER 2 (CENT)' },

    { id: 71, name: 'L RAMP DIVERTED' },
    { id: 72, name: 'L RAMP ENTRANCE' },
    { id: 74, name: 'LEFT RAMP EXIT' },
    { id: 75, name: 'R RAMP ENTRANCE' },
    { id: 76, name: 'LOCK MECH LOW' },
    { id: 77, name: 'LOCK MECH HIGH' },
    { id: 78, name: 'RIGHT RAMP EXIT' },

    { id: 81, name: 'LEFT JET BUMPER' },
    { id: 82, name: 'UPPER JET BUMPER' },
    { id: 83, name: 'LOWER JET BUMPER' },
    { id: 84, name: 'LEFT SLINGSHOT' },
    { id: 85, name: 'RIGHT SLINGSHOT' },
    { id: 86, name: 'KICKBACK' },
    { id: 87, name: 'UPPER LEFT LANE' },
    { id: 88, name: 'UPPER RIGHT LANE' },
  ],
  fliptronicsMapping: [
    { id: 'F1', name: 'R FLIPPER EOS' },
    { id: 'F2', name: 'R FLIPPER BUTTON' },
    { id: 'F3', name: 'L FLIPPER EOS' },
    { id: 'F4', name: 'L FLIPPER BUTTON' },
    { id: 'F5', name: 'RIGHT SPINNER' },
    { id: 'F6', name: 'UR FLIPPER BUTTON' },
    { id: 'F7', name: 'LEFT SPINNER' },
    { id: 'F8', name: 'UL FLIPPER BUTTON' },
  ],
  playfield: {
    //size must be 200x400, lamp positions according to image
    image: 'playfield-wcs.jpg',
  },
  skipWpcRomCheck: false,
  features: [
    'securityPic',
    'wpcSecure',
  ],
  cabinetColors: [
    '#4F4EB2',
    '#59C5CC',
    '#EDE34C',
    '#D13A2A',
  ],
  initialise: {
    closedSwitches: [
      22,
      //OPTO SWITCHES: 31, 32, 33, 34, 35, 36, 41, 42, 43, 44, 45, 51, 52, 53
      36, 41, 42, 43, 44, 45, 51, 52, 53,
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  },
};
