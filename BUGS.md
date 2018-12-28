# Known Issues

There are some known issues with the Emu, here I try to collect most of them.

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
- GI (General Illumination dimming) to implemented properly
- DIP language selection does not work for TZ

## Hurricane

Randomly Hurricane crashes with this error:

```
Error: INVALID_WRITE_SUBSYSTEM_0xbfc2 {"offset":16322,"subsystem":"system"} 1
```

- Crash with the hurricane pinball - jackpot ("the wheel"), end of 2x, 3x or 5x bonus
- DMD is messes up after the bonus selection
- Guess its related to timing

## Circus Voltare

- need to open/close "COIN DOOR" switch manually to pass the ringmaster test
- Ringmaster test fails, as a switch should be triggered after a solenoid is triggered

## No Fear / STTNG

- cannot start game, probably because of invalid switch state

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

## WPC95 (Medieval Madness / Attack From Mars / Circus Voltaire ...)

After about 100k cycles the emu crashes with this error message:

```
21:05:36.646 cpu-board.js:256 CPU_WRITE8_FAIL {"offset":32766,"subsystem":"system"} 65534 142
  ```

Somehow mm writes to the registerS position. Depending on the initial value of registerS, the emu write to whatever is stored there.

Best guess is that there's a bug in the CPU which triggers this issue.

# Johnny Mnemonic

Misc crashes:
- @ 11MIO ops

```
00:05:37.283 asic.js:391 R_NOT_IMPLEMENTED 0x3fe2 0
00:05:37.283 asic.js:391 R_NOT_IMPLEMENTED 0x3fe3 0
00:05:37.283 asic.js:391 R_NOT_IMPLEMENTED 0x3fe4 30
00:05:37.284 asic.js:391 R_NOT_IMPLEMENTED 0x3fe5 32
00:05:37.285 asic.js:391 R_NOT_IMPLEMENTED 0x3fe6 62
00:05:37.286 asic.js:391 R_NOT_IMPLEMENTED 0x3fea 28
00:05:37.287 asic.js:391 R_NOT_IMPLEMENTED 0x3ff0 0
00:05:37.287 asic.js:391 R_NOT_IMPLEMENTED 0x3ff1 0
00:05:37.288 asic.js:391 R_NOT_IMPLEMENTED 0x3ff3 0
00:05:37.289 externalIo.js:75 IO R_NOT_IMPLEMENTED 0x3fd6
00:05:37.290 externalIo.js:75 IO R_NOT_IMPLEMENTED 0x3fd9
00:05:37.396 cpu-board.js:256 CPU_WRITE8_FAIL {"offset":32512,"subsystem":"system"} 65280 47
...
00:05:37.604 cpu-board.js:256 CPU_WRITE8_FAIL {"offset":10784,"subsystem":"system"} 43552 0
00:05:37.605 cpu-board.js:256 CPU_WRITE8_FAIL {"offset":10785,"subsystem":"system"} 43553 80
00:05:37.606 cpu6809.js:2322 Uncaught Error: CPU_OPCODE_INVALID_PAGE2_0
    at Cpu6809.step (cpu6809.js:2322)
    at Cpu6809.steps (cpu6809.js:2413)
    at WpcCpuBoard.executeCycle (cpu-board.js:159)
    at Emulator.executeCycle (emulator.js:46)
    at step (main.js:103)
```

```
cpu-board.js:256 CPU_WRITE8_FAIL {"offset":32755,"subsystem":"system"} 65523 242
cpu-board.js:256 CPU_WRITE8_FAIL {"offset":14847,"subsystem":"bank"} 31231 72
cpu-board.js:256 CPU_WRITE8_FAIL {"offset":32767,"subsystem":"system"} 65535 255
cpu-board.js:256 CPU_WRITE8_FAIL {"offset":32767,"subsystem":"system"} 65535 255
cpu6809.js:474 Uncaught Error: TFREXG_ERROR
    at Cpu6809.TFREXG (cpu6809.js:474)
    at Cpu6809.step (cpu6809.js:1106)
    at Cpu6809.steps (cpu6809.js:2413)
    at WpcCpuBoard.executeCycle (cpu-board.js:159)
    at Emulator.executeCycle (emulator.js:46)
    at step (main.js:103)
​```

```
CPU_WRITE8_FAIL {"offset":32745,"subsystem":"system"} 65513 126
cpu-board.js:256 CPU_WRITE8_FAIL {"offset":32746,"subsystem":"system"} 65514 147
cpu-board.js:256 CPU_WRITE8_FAIL {"offset":4104,"subsystem":"system"} 36872 147
cpu6809.js:643 Uncaught Error: INVALID_ADDRESS_MODE_0x0E
    at Cpu6809.PostByte (cpu6809.js:643)
    at Cpu6809.step (cpu6809.js:1947)
    at Cpu6809.steps (cpu6809.js:2413)
    at WpcCpuBoard.executeCycle (cpu-board.js:159)
    at Emulator.executeCycle (emulator.js:46)
    at step (main.js:103)
```

- Misc issues here, maybe related to the Medieval Madness issue?
- Paging issue? read 2nd page of system rom?
- double the CALL_IRQ_AFTER_TICKS value "fixes the issue"

CALL_IRQ_AFTER_TICKS: 1300 -> crash
CALL_IRQ_AFTER_TICKS: 2047 -> crash
CALL_IRQ_AFTER_TICKS: 3000 -> crash
CALL_IRQ_AFTER_TICKS: 3200 -> ok, but error pattern is visible
CALL_IRQ_AFTER_TICKS: 3300 -> ok
CALL_IRQ_AFTER_TICKS: 3500 -> ok
CALL_IRQ_AFTER_TICKS: 4000 -> ok


# TRACE DUMP COMPARE WITH MAME

Loading hurricane

```
CC=50 A=0006 B=0000 X=8193 Y=0000 S=1728 U=2E2F 9E22: ANDCC #$AF
-CC=00 A=0006 B=0000 X=8193 Y=0000 S=1728 U=2E2F 9E24: JSR   $925D
+CC=90 A=0006 B=0000 X=8193 Y=0000 S=171C U=2E2F 90BF: LDA   #$96
CC=98 A=0096 B=0000 X=8193 Y=0000 S=171C U=2E2F 90C1: STA   $3FFF
```
- WPC EMU: AND 0x50 with 0xAF -> result is 0.
- MAME: same, but then explicit IRQ CHECK
-> might be just a disassembler issue, as the next instruction is correct. a pending interrupt is not shown in the WPC disabembler


```
...
-CC=56 A=00FF B=0000 X=6F5F Y=0000 S=1719 U=2E2F 864C: LEAS  $1,S
-CC=56 A=00FF B=0000 X=6F5F Y=0000 S=171A U=2E2F 864E: PULS  A,B,X,Y,PC
-CC=56 A=00FF B=0000 X=8193 Y=0000 S=1722 U=2E2F 6F5F: BCC   $6F6B
-CC=56 A=00FF B=0000 X=8193 Y=0000 S=1722 U=2E2F 6F6B: PULS  A,PC
-CC=56 A=0006 B=0000 X=8193 Y=0000 S=1725 U=2E2F 88EF: PSHS  CC,A
-CC=56 A=0006 B=0000 X=8193 Y=0000 S=1723 U=2E2F 88F1: LDA   $2,S
+CC=54 A=00FF B=0000 X=6F5F Y=0000 S=1719 U=2E2F 864C: LEAS  $1,S
+CC=54 A=00FF B=0000 X=6F5F Y=0000 S=171A U=2E2F 864E: PULS  A,B,X,Y,PC
+CC=54 A=00FF B=0000 X=8193 Y=0000 S=1722 U=2E2F 6F5F: BCC   $6F6B
+CC=54 A=00FF B=0000 X=8193 Y=0000 S=1722 U=2E2F 6F6B: PULS  A,PC
+CC=54 A=0006 B=0000 X=8193 Y=0000 S=1725 U=2E2F 88EF: PSHS  A,CC
+CC=54 A=0006 B=0000 X=8193 Y=0000 S=1723 U=2E2F 88F1: LDA   $2,S
...

WPC CC: 56    0101 0110
MAME CC: 54   0101 0100
```
-> Overflow flag not correct
