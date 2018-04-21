# Goal

- Emulate the Williams Pinball machine "Hurricane"
- 2nd generation hardware called "WPC Dot Matrix" aka WPC DMD (WPC89 board)

## Steps

# Basic
- read Game ROM file ✓
- emulate CPU ✓
- implement CPU IRQ
- dip switch settings for rom size

# Display
- implement Bankswitching
- implement Hardware
- emulate Dot Matrix controller
- display Dot Matrix display

# Sound
- read Sound ROM files
- emulate YM2151 sound chip
- emulate HC55536 sound chip (speech synth)

# UI
- display pinball field with elements (switches, ramps etc)
- implement physic systems for the ball

## WPS Dot Matrix Machine

Overview:

```
       [MEMORY]  [DMD-BOARD]
              \     |
     [CPU] - [WPC-ASIC]
              /      |   
  [SOUND-BOARD]  [IO-EXTENDER]
```

### CPU
- Main CPU: Motorola 6809 (68B09E) at 2 MHz, 8-bit/16-bit CPU and between 128KB and 1MB of EPROM for the game program

### MEMORY
- Total 8KB RAM, battery-backed
- The memory storage format is Big Endian

### WPC-ASIC
- Custom ASIC chip by Williams, mainly a huge mapper
- Its memory address space is 64 KiB (linear $0000 to $FFFF, 16Bit address)
- Can address 8KB RAM, 8KB Hardware, 16KB Bank switched Game ROM, 32KB System ROM

### SOUND-BOARD
- intelligent and have processors running their own operating system dedicated to sound tasks
- stores all of the sound data on additional EPROMs, and has its own CPU that decodes the data and writes it to various audio devices
- Sound CPU: Motorola 6809
- Sound chips: Yamaha YM2151, DAC, Harris HC55536 CVSD

### DMD-BOARD
- The dot matrix display is 128 columns x 32 rows and refreshes at 122Mhz
- The controller board has the display RAM and the serialization logic
- The display RAM holds 8KB. A full DMD bit plane requires 128x32 pixels, that is, 4096 bits, or 512 bytes. Thus, there is enough RAM to hold a total of 16 planes. At any time, at most two planes can be addressed by the CPU

Operating system: APPLE OS (created by Williams, not related to the company Apple, but "Advanced Pinball Programming Logic Executive") - aka the system ROM


# References

## WPC

- http://bcd.github.io/freewpc/The-WPC-Hardware.html
- https://en.wikipedia.org/wiki/Williams_Pinball_Controller
- http://www.maddes.net/pinball/wpc_debugging.htm

## CPU
- http://atjs.mbnet.fi/mc6809/
- https://github.com/maly/6809js
- http://www.roust-it.dk/coco/6809irq.pdf

## Sound Chip
- http://www.ionpool.net/arcade/gottlieb/technical/datasheets/YM2151_datasheet.pdf
- https://sourceforge.net/p/pinmame/code/HEAD/tree/trunk/src/sound/
