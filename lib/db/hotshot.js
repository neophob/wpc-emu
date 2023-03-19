module.exports = {
  name: 'WPC-DMD: Hot Shot Basketball (Redemption game)',
  version: 'P-8',
  pinmame: {
    knownNames: [ 'hshot_p8', 'hshot_p9' ],
    gameName: 'Hot Shot Basketball',
    id: 'hshot',
  },
  rom: {
    u06: 'hshot_p8.u6',
  },
  switchMapping: [
    { id: 13, name: 'START BUTTON' },
    { id: 15, name: 'SERVE BALL LEFT' },
    { id: 16, name: 'SERVE BALL RIGHT' },
    { id: 17, name: 'SELECT GAME' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'TICKED OPTQ' },
    { id: 26, name: 'BALL IN SHOOTER' },
    { id: 27, name: 'DISPENSER LOW' },
    { id: 28, name: 'DISPENSER UNJAM' },

    { id: 31, name: 'BASKET' },
    { id: 32, name: 'BASKET MTR TOP' },
    { id: 33, name: 'BASKET MTR BOT' },
  ],
  skipWpcRomCheck: true,
  features: [
    'wpcDmd',
  ],
  cabinetColors: [
    '#2153C6',
    '#A22C2C',
    '#ED9643',
    '#F5DC60',
  ],
  initialise: {
    closedSwitches: [
      22
    ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  },
  testError: [
    'ERROR-BASKET NOT CALIBRATED',
    'CHK. BASKET MOTOR AND SW32/SW33',
  ]
};
