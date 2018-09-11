'use strict';

module.exports = {
  name: 'Dr. Who',
  version: 'L-1',
  rom: {
    u06: 'https://s3-eu-west-1.amazonaws.com/foo-temp/drwho_l2.rom',
    u14: 'https://s3-eu-west-1.amazonaws.com/foo-temp/dw_u14.l1',
    u15: 'https://s3-eu-west-1.amazonaws.com/foo-temp/dw_u15.l1',
    u18: 'https://s3-eu-west-1.amazonaws.com/foo-temp/dw_u18.l1',
  },
  skipWmcRomCheck: true,
  initialise: {
    closedSwitches: [ 15, 16, 17 ],
    initialAction: [
    ],
  }
};