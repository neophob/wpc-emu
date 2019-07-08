'use strict';

// IRQ is generated 976 times per second
// each 1.0245ms, 2000000/976 -> 2049
const CALL_IRQ_AFTER_TICKS = 2049;

// one scanline has 128 pixels -> packed in 16 bytes it takes 32 CPU cycles to transfer one byte
// -> 16bytes * 32cycles => total 512 ticks to copy one scanline
// A 128x32 plasma display with 16 pages and refreshed at 240Hz (for PWM luminosity control)
// each 256us, one page in 8192us, * 122
const CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS = 512;

// ZeroCross should occur 120 times per second (NTSC running at 60Hz, EU running at 50Hz)
// US: each 8.3ms, 16667/2000 -> 8.3, 2000000/120 -> 16667 cycles
// EU: each 10ms, 20000/2000 -> 10, 2000000/100 -> 20000 cycles
const CALL_ZEROCLEAR_AFTER_TICKS = 16667;

//Update Lamp matrix, update 60 times per second

/*
 * At IRQ time, the column strobe is repeatedly switched among the 8
 * columns, at a rate of every 2ms.  Thus, the effective time to redraw
 * the entire lamp matrix is 16ms.

 TIME_166MS

 SOURCE: freewpc/build/sched_irq.c

 switch_rtt (); /* 0.286885 interrupts / 560 cycles
 lamp_rtt (); /* 0.0461066 interrupts / 90 cycles
 sol_update_rtt_0 (); /* 0.0307377 interrupts / 60 cycles
 sol_update_rtt_1 (); /* 0.0307377 interrupts / 60 cycles
 fliptronic_rtt (); /* 0.128074 interrupts / 250 cycles
 lamp_flash_rtt (); /* 0.0512295 interrupts / 100 cycles

*/
const CALL_UPDATELAMP_AFTER_TICKS = 64*95;//41667 * 2;//CALL_IRQ_AFTER_TICKS * 8 * 8;

//Update Solenoid matrix, update 8 times per second
// TODO must be implemented properly
const CALL_UPDATESOLENOID_AFTER_TICKS = CALL_UPDATELAMP_AFTER_TICKS * 8;

// The watchdog is reset in every IRQ call
// As a CPU cycle might run longer than 2049 ticks, the watchdog counter needs some additional ticks
const WATCHDOG_GRACE_TICKS = CALL_IRQ_AFTER_TICKS + 64;
const WATCHDOG_ARMED_FOR_TICKS = CALL_IRQ_AFTER_TICKS + WATCHDOG_GRACE_TICKS;

module.exports = {
  CALL_IRQ_AFTER_TICKS,
  CALL_WPC_UPDATE_DISPLAY_AFTER_TICKS,
  CALL_ZEROCLEAR_AFTER_TICKS,
  CALL_UPDATELAMP_AFTER_TICKS,
  CALL_UPDATESOLENOID_AFTER_TICKS,
  WATCHDOG_ARMED_FOR_TICKS,
};
