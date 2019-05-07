'use strict';

// IRQ is generated 976 times per second
// each 1.0245ms, 2000000/976 -> 2049
const CALL_IRQ_AFTER_TICKS = 2049;

// one scanline has 128 pixels -> packed in 16 bytes it takes 32 CPU cycles to transfer one byte
// -> 16bytes * 32cycles => total 512 ticks to copy one scanline
// A 128x32 plasma display with 16 pages and refreshed at 240Hz (for PWM luminosity control)
// each 256us, one page in 8192us, * 122
const CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS = 512;

// ZeroCross should occur 120 times per second (NTSC running at 60Hz)
// each 8.3ms, 16667/2000 -> 8.3, 2000000/120 -> 16667
const CALL_ZEROCLEAR_AFTER_TICKS = 16667;

//Update Lamp matrix, update 60 times per second
const CALL_UPDATELAMP_AFTER_TICKS = 33333;

//Update Solenoid matrix, update 8 times per second
// TODO must be implemented properly
const CALL_UPDATESOLENOID_AFTER_TICKS = CALL_UPDATELAMP_AFTER_TICKS * 8;

const WATCHDOG_ARMED_FOR_TICKS = 2049 * 2;

module.exports = {
  CALL_IRQ_AFTER_TICKS,
  CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS,
  CALL_ZEROCLEAR_AFTER_TICKS,
  CALL_UPDATELAMP_AFTER_TICKS,
  CALL_UPDATESOLENOID_AFTER_TICKS,
  WATCHDOG_ARMED_FOR_TICKS,
};
