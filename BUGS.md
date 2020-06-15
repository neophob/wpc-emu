# Known Issues

There are some known issues with the Emu, here I try to collect most of them.

However there are some more problematic ROM's:
- MM/MB: reference WPC95 implementation, only games that change the reset vector
- WW: Flickering on the main screen

## Unclear implementation details

### ADD operation, set halfcarry bit

Which implementation is correct:

```
if ((sTemp ^ ucByte1 ^ ucByte2) & 0x10)
   regs->ucRegCC |= F_HALFCARRY;
```

```
if (((sTemp ^ ucByte1 ^ ucByte2) & 0x10) << 1)
  regs->ucRegCC |= F_HALFCARRY;
```

### Set overflow flag

should r be converted to an 8bit value?
```
setV8(a, b, r) {
  this.regCC |= ((a ^ b ^ r ^ (r >> 1)) & 0x80) >> 6;
}
```

## Missing EMU features

- enable / disable IRQ in the ASIC emu should work - currently the IRQ is fired all the time

## Circus Voltare

- need to open/close "COIN DOOR" switch manually to pass the ringmaster test
- Ringmaster test fails, as a switch should be triggered after a solenoid is triggered

## No Fear / STTNG

- cannot start game, need to toggle THROUGH switch

## Adams Family Values

- cannot start game, probably because of the invalid switch settings

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
