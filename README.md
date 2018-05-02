# WPC (Dot Matrix) Emulator

## Goal

- Emulate the Williams Pinball machine WPC-89 (6/91 - 10/91)
- 2nd generation hardware called "WPC Dot Matrix" aka WPC DMD (WPC89 board)
- Emulate game "Hurricane" - also "Gilligan's Island", "Terminator2" and "Party Zone"

# State
- it boots!
- dmd works somehow, shading is missing
- wpc shows invalid ram settings -> TODO add dump nvram to get "valid" settings
- after 60 millions ticks it looks like it restarts somehow, after that irq needs to be reenabled -> might be related to input matrix
- then game boots up

# Implementation Status

Reference: http://bcd.github.io/freewpc/The-WPC-Hardware.html#The-WPC-Hardware

## Basic
- read Game ROM file ✓
- emulate 6809 CPU ✓

## CPU Board
- Blanking (not sure if needed)
- Diagnostics LED ✓
- Watchdog (not sure if needed, no reboot in case of an error)
- Bit Shifter ✓
- Memory Protection (not sure if needed)
- Time of Day Clock ✓
- High Resolution Timer (not used, was used by alphanumeric games to do display dimming)
- Bank Switching ✓
- The Switch Matrix
- External I/O ✓ (except sound)
- Interrupt Reset (only needed for watchdog)
- Interrupt IRQ ✓
- Interrupt FIRQ ✓ (incl. source - not sure if needed)

## Power Driver Board
- Lamp Circuits
- Solenoid Circuits
- General Illumination Circuits (Triac)
- Zero Cross Circuit ✓

## Sound Board
- load Sound ROM files
- emulate 6809 CPU ✓
- emulate YM2151 FM Generator
- emulate HC-55536 CVSD (speech synth)
- emulate MC6821 PIA

## Dot Matrix Controller Board
- Page Selection ✓
- Scanline Handling ✓
- Dimming / multi color display

## Debug UI
- DMD output ✓
- Debug KPI ✓
- Cabinet input keys work

# Future ideas
- Hook it up to a broken Pinball machine, replace whole electronics with a RPI

# WPS Dot Matrix Machine

## Overview:

```
       [MEMORY]  [DMD-BOARD]
              \     |
     [CPU] - [WPC-ASIC]
              /      |   
  [SOUND-BOARD]  [IO-EXTENDER]
```

Operating system: APPLE OS (created by Williams, not related to the company Apple, but "Advanced Pinball Programming Logic Executive") - aka the system ROM

## CPU BOARD
- Williams part number A-12742
- Main CPU: Motorola 6809 (68B09E) at 2 MHz, 8-bit/16-bit CPU and between 128KB and 1MB of EPROM for the game program
- Custom ASIC chip by Williams, mainly a huge mapper
- Its memory address space is 64 KiB (linear $0000 to $FFFF, 16Bit address)
- Can address 8KB RAM, 8KB Hardware, 16KB Bank switched Game ROM, 32KB System ROM
- Game ROM name: U6

### MEMORY
- Total 8KB RAM, battery-backed
- The memory storage format is Big Endian

## POWER-DRIVER-BOARD
- Williams part number: A-12697-1

## SOUND-BOARD
- Williams part number: A-12738 (aka. pre-DCS sound)
- Mono output, Sample rate 11KHz, 25 watts power, 8 ohm
- intelligent and have processors running their own operating system dedicated to sound tasks
- CPU: Motorola 6809 (MC68A09EP), frequency 2MHz
- OPM: Yamaha YM2151 (FM Operator Type-M), frequency 3.579545MHz
- DAC (Digital Analog converter)
- Harris HC-55536 CVSD (Continuously variable slope delta modulation)
- MC6821 Peripheral Interface Adaptor (PIA)
- ROMS: U14, U15 and U18

## DMD-BOARD
- Williams part number A-14039
- The dot matrix display is 128 columns x 32 rows and refreshes at 122Mhz
- The controller board has the display RAM and the serialisation logic
- The display RAM holds 8KB. A full DMD bit plane requires 128x32 pixels, that is, 4096 bits, or 512 bytes. Thus, there is enough RAM to hold a total of 16 planes. At any time, at most two planes can be addressed by the CPU

# Timing
- CPU run at 2 MHZ, this means 2'000'000 clock ticks/s -> The CPU execute 2 cycles per us.
- CPU IRQ is called 976 times/s, that a IRQ call each 1025us
- ZeroCross should occur 120 times per second (NTSC running at 60Hz), so each 8.3ms

Timings are very tight, we cannot use `setTimeout`/`setInterval` to call for example the IRQ. So the main idea is to run one
main loop that executes some CPU ops then check if one of the following callbacks need to be triggered:
- each 2049 ticks call IRQ (1025us)
- each 16667 ticks update ZeroCross flag (8.3ms)
- each 512 ticks update display Scanline (256us)

## DMD display scanline
The controller fetches 1 byte (8 pixels) every 32 CPU cycles (16 microseconds). At this rate, it takes 256 microseconds per row and a little more than 8 milliseconds per complete frame.

# References

## WPC

- http://bcd.github.io/freewpc/The-WPC-Hardware.html
- https://en.wikipedia.org/wiki/Williams_Pinball_Controller
- http://www.maddes.net/pinball/wpc_debugging.htm
- https://bitbucket.org/grumdrig/williams/src/master/
- http://www.edcheung.com/album/album07/Pinball/wpc_sound.htm

## DMD
- http://webpages.charter.net/coinopcauldron/dotarticle.html

## CPU
- http://atjs.mbnet.fi/mc6809/
- https://github.com/maly/6809js (use this CPU core, fixed typos + implemented IRQ handling)
- http://www.roust-it.dk/coco/6809irq.pdf

## Sound Chip
- http://www.ionpool.net/arcade/gottlieb/technical/datasheets/YM2151_datasheet.pdf
- https://sourceforge.net/p/pinmame/code/HEAD/tree/trunk/src/sound/
- https://github.com/kode54/Game_Music_Emu/blob/master/gme/
- http://www.cx5m.net/fmunit.htm
- https://github.com/apollolux/ym2413-js/blob/master/ym2413.js
- https://github.com/vgm/node-vgmplay/blob/master/res/js/vgm/ym2151.js (use this CPU core)

# ROM
- http://www.planetarypinball.com/mm5/Williams/tech/wpcroms.html
