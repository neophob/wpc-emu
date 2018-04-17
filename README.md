# Goal

- Emulate the Williams Pinball machine "Hurricane"

## Steps

- read ROM file
- emulate CPU
- display Dot Matrix content
- display pinbal field with element (switches)
- implement physic systems for the ball

## WPS Dot Matrix

- Main CPU: Motorola 6809 (68B09E) at 2 MHz, 8KB of RAM, 8-bit/16-bit CPU and between 128KB and 1MB of EPROM for the game program.
- Its memory address space is 64 KiB (linear $0000 to $FFFF, 16Bit address). The memory storage format is Big Endian.
- Sound CPU: Motorola 6809 (Pre-DCS)
- Sound chips (Pre-DCS): Yamaha YM2151, DAC, Harris HC55536 CVSD
- Operating system: APPLE OS (created by Williams, not related to the company Apple, but "Advanced Pinball Programming Logic Executive")
- The dot matrix display is 128 columns x 32 rows

# References

- http://bcd.github.io/freewpc/The-WPC-Hardware.html
- https://en.wikipedia.org/wiki/Williams_Pinball_Controller
- http://www.maddes.net/pinball/wpc_debugging.htm
- http://atjs.mbnet.fi/mc6809/
- https://github.com/maly/6809js
