'use strict';

module.exports = {
  name: 'Dirty Harry',
  version: 'LX-2',
  rom: {
    u06: 'https://s3-eu-west-1.amazonaws.com/foo-temp/harr_lx2.rom',
    //dh_snd.u2 - dh_snd.u6
  },
  switchMapping: [
    { id: 11, name: 'GUN HANDLE TRIGGER' },
    { id: 13, name: 'START BUTTON' },
    { id: 14, name: 'PLUMB BOB TILT' },
    { id: 15, name: 'SHOTTER LANE' },
    { id: 16, name: 'RIGHT OUTLANE' },
    { id: 17, name: 'RIGHT INLANE' },
    { id: 18, name: 'STANDUP 8' },

    { id: 21, name: 'SLAM TILT' },
    { id: 22, name: 'COIN DOOR CLOSED' },
    { id: 23, name: 'EX BALL BUTTON' },
    { id: 25, name: 'LEFT INLANE' },
    { id: 26, name: 'LEFT OUTLANE' },
    { id: 27, name: 'STANDUP 1' },
    { id: 28, name: 'STANDUP 2' },
    
    { id: 31, name: 'TROUGH JAM' },
    { id: 32, name: 'TROUGH 1' },
    { id: 33, name: 'TROUGH 2' },
    { id: 34, name: 'TROUGH 3' },
    { id: 35, name: 'TROUGH 4' },
    { id: 38, name: 'RIGHT RAMP MAKE' },

    { id: 41, name: 'LEFT RAMP ENTER' },
    { id: 42, name: 'RIGHT LOOP' },
    { id: 43, name: 'LEFT RAMP MAKE' },
    { id: 44, name: 'GUN CHAMBER' },
    { id: 45, name: 'GUN POPPER' },
    { id: 46, name: 'TOP R POPPER' },
    { id: 47, name: 'LEFT POPPER' },

    { id: 51, name: 'RIGHT RAMP ENTER' },
    { id: 53, name: 'DROP TARGET DOWN' },
    { id: 54, name: 'STANDUP 6' },
    { id: 55, name: 'STANDUP 7' },
    { id: 56, name: 'STANDUP 5' },
    { id: 57, name: 'STANDUP 4' },
    { id: 58, name: 'STANDUP 3' },
    
    { id: 61, name: 'LEFT SLING' },
    { id: 62, name: 'RIGHT SLING' },
    { id: 63, name: 'LEFT JET' },
    { id: 64, name: 'MIDDLE JET' },
    { id: 65, name: 'RIGHT JET' },
    { id: 66, name: 'LEFT ROLLOVER' },
    { id: 67, name: 'MIDDLE ROLLOVER' },
    { id: 68, name: 'RIGHT ROLLOVER' },
    
    { id: 71, name: 'LEFT LOOP' },
    { id: 73, name: 'TOP L POPPER' },
    { id: 76, name: 'GUN POSITION' },
    { id: 77, name: 'GUN LOOKUP' },

    { id: 88, name: 'TEST SWITCH' },
  ],
  skipWmcRomCheck: true,
  initialise: {
    closedSwitches: [ 22, 32, 33, 34, 35 ],
    initialAction: [
      {
        delayMs: 1000,
        source: 'cabinetInput',
        value: 16
      }
    ],
  }
};