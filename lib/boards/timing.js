'use strict';

// IRQ is generated 976 times per second
// each 1.0245ms
const CALL_IRQ_AFTER_TICKS = 2049;

// one scanline has 128 pixels -> packed in 16 bytes it takes 32 CPU cycles to transfer one byte
// -> 16bytes * 32cycles => total 512 ticks to copy one scanline
// A 128x32 plasma display with 16 pages and refreshed at 240Hz (for PWM luminosity control)
// each 256us, one page in 8192us, * 122
const CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS = 512;

// ZeroCross should occur 120 times per second (NTSC running at 60Hz)
// each 8.3ms, 16667/2000 -> 8.3
const CALL_ZEROCLEAR_AFTER_TICKS = 16667;

module.exports = {
  CALL_IRQ_AFTER_TICKS,
  CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS,
  CALL_ZEROCLEAR_AFTER_TICKS,
};
