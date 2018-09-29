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

## Dirty Harry

```
cpu-board.js:279 EXPANSION_WRITE_NOT_IMPL {offset: 13116, value: 255} offset: 13116value: 255__proto__: Object
19:39:41.452 cpu-board.js:279 EXPANSION_WRITE_NOT_IMPL {offset: 13117, value: 6}
19:39:41.454 cpu-board.js:279 EXPANSION_WRITE_NOT_IMPL {offset: 13116, value: 65}
19:39:41.456 cpu-board.js:279 EXPANSION_WRITE_NOT_IMPL {offset: 13117, value: 6}
19:39:41.457 cpu-board.js:300 EXPANSION_READ_NOT_IMPL {offset: 13116}
19:39:41.458 EXPANSION_WRITE_NOT_IMPL {offset: 13116, value: 255} offset: 13116value: 255__proto__: Object
19:39:41.452 cpu-board.js:279 EXPANSION_WRITE_NOT_IMPL {offset: 13117, value: 6}
19:39:41.454 cpu-board.js:279 EXPANSION_WRITE_NOT_IMPL {offset: 13116, value: 65}
19:39:41.456 cpu-board.js:279 EXPANSION_WRITE_NOT_IMPL {offset: 13117, value: 6}
19:39:41.457 cpu-board.js:300 EXPANSION_READ_NOT_IMPL {offset: 13116}
19:39:41.458 cpu-board.js:279 EXPANSION_WRITE_NOT_IMPL {offset: 13116, value: 255}
19:39:41.460 cpu6809.js:636 Uncaught Error: INVALID_ADDRESS_MODE_0x0E
    at Cpu6809.PostByte (cpu6809.js:636)
    at Cpu6809.step (cpu6809.js:1365)
    at Cpu6809.steps (cpu6809.js:2415)
    at WpcCpuBoard.executeCycle (cpu-board.js:153)
    at Emulator.executeCycle (emulator.js:45)
    at step (main.js:102)
PostByte @ cpu6809.js:636
step @ cpu6809.js:1365
steps @ cpu6809.js:2415
executeCycle @ cpu-board.js:153
executeCycle @ emulator.js:45
```

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

    wpcemu:boards:sound-board: CPU_WRITE8_FAIL {offset: "0xfa39", subsstem: "rom", value: 149}
    23:11:55.400 sound-board.js:242 wpcemu:boards:sound-board: CPU_WRITE8_FAIL {offset: "0xfa3a", subsstem: "rom", value: 60}
    23:11:55.400 sound-board.js:242 wpcemu:boards:sound-board: CPU_WRITE8_FAIL {offset: "0xfa3b", subsstem: "rom", value: 149}
    23:11:55.401 sound-board.js:242 wpcemu:boards:sound-board: CPU_WRITE8_FAIL {offset: "0xfa3c", subsstem: "rom", value: 60}

    last Transitions test
    cpu-board.js:233 Uncaught Error: INVALID_WRITE_SUBSYSTEM_0x47e0
        at WpcAsic._write8 (cpu-board.js:233)
        at Cpu6809.WriteWord (cpu6809.js:502)
        at Cpu6809.step (cpu6809.js:1668) >> this.oADD
        at Cpu6809.steps (cpu6809.js:2378)
        at WpcAsic.executeCycle (cpu-board.js:141)
        at Emulator.executeCycle (emulator.js:45)
        at step (main.js:103)    

        case 0xaf: //STX indexed
          addr = this.PostByte();
          >> this.WriteWord(addr, this.regX);
          this.flagsNZ16(this.regX);
          this.regCC &= ~F_OVERFLOW;
          break;

    Last font test
    CPU_WRITE8_FAIL {"offset":312,"subsystem":"bank"} 16696 255
    cpu-board.js:233 Uncaught Error: INVALID_WRITE_SUBSYSTEM_0x4138
        at WpcAsic._write8 (cpu-board.js:233)
        at Cpu6809.WriteWord (cpu6809.js:502)
        at Cpu6809.step (cpu6809.js:1938) >> this.oADC
        at Cpu6809.steps (cpu6809.js:2379)
        at WpcAsic.executeCycle (cpu-board.js:141)
        at Emulator.executeCycle (emulator.js:45)
        at step (main.js:103)        

        case 0xed: //STD indexed
          addr = this.PostByte();
          >> this.WriteWord(addr, this.getD());
          this.regCC &= ~F_OVERFLOW;
          break;

  dmd-board.js:207 DMD R_NOT_IMPLEMENTED 0x3fb0 0
  00:04:43.898 dmd-board.js:177 DMD W_NOT_IMPLEMENTED 0x3fb0 67
  00:04:43.899 dmd-board.js:207 DMD R_NOT_IMPLEMENTED 0x3fbf 10
  00:04:43.900 externalio-board.js:53 IO R_NOT_IMPLEMENTED 0x3fc0
  00:04:43.900 externalio-board.js:41 IO W_NOT_IMPLEMENTED 0x3fc0 66
  00:04:43.901 externalio-board.js:53 IO R_NOT_IMPLEMENTED 0x3fcf
  00:04:43.902 externalio-board.js:53 IO R_NOT_IMPLEMENTED 0x3fd0
  00:04:43.902 externalio-board.js:41 IO W_NOT_IMPLEMENTED 0x3fcf 128
  00:04:43.903 externalio-board.js:41 IO W_NOT_IMPLEMENTED 0x3fd0 87
  00:04:43.903 sound-board.js:295 wpcemu:boards:sound-board R_NOT_IMPLEMENTED 0x3fdf undefined
  00:04:43.904 cpu-board-asic.js:342 R_NOT_IMPLEMENTED 0x3fe0 0
  00:04:43.905 sound-board.js:278 SND_W_NOT_IMPLEMENTED 0x3fdf 128
  00:04:43.906 cpu-board-asic.js:342 R_NOT_IMPLEMENTED 0x3ff0 0
  00:04:43.906 cpu-board-asic.js:263 W_NOT_IMPLEMENTED 0x3ff0 2          

```


## Medieval Madness

After about 100k cycles the emu crashes with this error message:

```
CPU_WRITE8_FAIL {"offset":32767,"subsystem":"system"} -1 191
UNHANDLED_REJECTION { msg: 'INVALID_WRITE_SUBSYSTEM_0x-1',
  stack: 'Error: INVALID_WRITE_SUBSYSTEM_0x-1\n    at WpcAsic._write8 (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/cpu-board.js:231:15)\n    at Cpu6809.PUSHW (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/up/cpu6809.js:192:10)\n    at Cpu6809.step (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/up/cpu6809.js:1760:14)\n    at Cpu6809.steps (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/up/cpu6809.js:2406:21)\n    at WpcAsic.executeCycle (/Users/michaelvogt/_code/github/wpc-emu/lib/boards/cpu-board.js:139:36)\n    at Emulator.executeCycle (/Users/michaelvogt/_code/github/wpc-emu/lib/emulator.js:45:26)\n    at boot (/Users/michaelvogt/_code/github/wpc-emu/test/dmdripper/index.js:208:13)\n    at loadRomFilesPromise.then.then (/Users/michaelvogt/_code/github/wpc-emu/test/dmdripper/index.js:169:7)\n    at <anonymous>' }
  ```

- As no DCS/Fliptronics/Security Chip code is implemented, will retest once this subsystems has been implemented
