# Known Issues

There are some known issues with the Emu, here I try to collect most of them.

## Missing EMU features

- enable / disable IRQ in the ASIC emu should work - currently the IRQ is fired all the time
- GI (General Illumination dimming) to implemented properly
- DIP language selection does not work for TZ

## Hurricane

Randomly Hurricane crashes with this error:

```
Error: INVALID_WRITE_SUBSYSTEM_0xbfc2 {"offset":16322,"subsystem":"system"} 1
```

- Crash with the hurrican pinball - jackpot ("the wheel"), end of 2x, 3x or 5x bonus
- DMD is messes up after the bonus selection
- Guess its related to timing

## Circus Voltare

- need to open/close "COIN DOOR" switch manually to pass the ringmaster test
- Ringmaster test fails, as a switch should be triggered after a solenoid is triggered

## No Fear

- cannot start game, propbably because of invalid switch state

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

  CWAI might be broken!
```


## Medieval Madness

After about 100k cycles the emu crashes with this error message:

```
21:05:36.646 cpu-board.js:256 CPU_WRITE8_FAIL {"offset":32766,"subsystem":"system"} 65534 142
  ```

Somehow mm writes to the registerS position. Depending on the initial value of registerS, the emu write to whatever is stored there.

Best guess is that there's a bug in the CPU which triggers this issue.
