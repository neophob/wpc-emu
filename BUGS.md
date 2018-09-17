# Known Issues

There are some known issues with the Emu, here I try to collect most of them.

## Missing EMU features

- enable / disable IRQ in the ASIC emu should work - currently the IRQ is fired all the time
- CWAI instruction not implemented properly, not sure if its used at all
- GI (General Illumination dimming) to implemented properly
- Fliptronic Flipper not implemented

## Hurricane

Randomly Hurricane crashes with this error:

```
Error: INVALID_WRITE_SUBSYSTEM_0xbfc2 {"offset":16322,"subsystem":"system"} 1
```

- Crash with the hurrican pinball - jackpot ("the wheel"), end of 2x, 3x or 5x bonus
- DMD is messes up after the bonus selection
- Guess its related to timing

## FREEWPC T2

```
sound-board.js:244 wpcemu:boards:sound-board: CPU_WRITE8_FAIL {"offset":14907,"subsystem":"rom"} 64059 149
22:24:39.356 sound-board.js:245 Uncaught Error: SND_INVALID_WRITE_SUBSYSTEM_0x3a3b
    at SoundBoard._cpuWrite8 (sound-board.js:245)
    at Cpu6809.WriteWord (cpu6809.js:502)
    at Cpu6809.step (cpu6809.js:1937)
    at Cpu6809.steps (cpu6809.js:2378)
    at SoundBoard.executeCycle (sound-board.js:140)
    at WpcAsic.executeCycle (cpu-board.js:162)
    at Emulator.executeCycle (emulator.js:45)
    at step (main.js:103)
```
    
## Medieval Madness

After about 100k cycles the emu crashes with this error message:

```
CPU_WRITE8_FAIL {"offset":32767,"subsystem":"system"} -1 191
UNHANDLED_REJECTION { msg: 'INVALID_WRITE_SUBSYSTEM_0x-1',
  stack: 'Error: INVALID_WRITE_SUBSYSTEM_0x-1\n    at WpcAsic._write8 (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/cpu-board.js:231:15)\n    at Cpu6809.PUSHW (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/up/cpu6809.js:192:10)\n    at Cpu6809.step (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/up/cpu6809.js:1760:14)\n    at Cpu6809.steps (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/up/cpu6809.js:2406:21)\n    at WpcAsic.executeCycle (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/cpu-board.js:139:36)\n    at Emulator.executeCycle (/Users/michaelvogt/_code/github/wpc-emu/lib/emulator.js:45:26)\n    at boot (/Users/michaelvogt/_code/github/wpc-emu/test/dmdripper/index.js:208:13)\n    at loadRomFilesPromise.then.then (/Users/michaelvogt/_code/github/wpc-emu/test/dmdripper/index.js:169:7)\n    at <anonymous>' }
  ```

- As no DCS/Fliptronics/Security Chip code is implemented, will retest once this subsystems has been implemented
