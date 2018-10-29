# Goal

Create a trace file when starting the emu.

Useful to compare it with a MAME trace.

# Motivation

I could not find a test ROM that validated the CPU for a WPC machine. So the approach
is to dump a MAME ROM and compare that with a dump of wpc-emu to find any issues.

## Issues
- next OP might be wrong when an interrupt is pending, as interrupts are evaluated before the next OP is fetched - but not AFTER the OP is executed.

## Env variables
- `ROMFILE`: define rom file
- `HAS_SECURITY_FEATURE` if set to true, security pic will be emulated
- `STEPS`: numbers of steps to run

## Create WPC-Emu dump file

Tracer write trace output to stderr.

Example:

```
env ROMFILE=../../rom/john1_2r.rom HAS_SECURITY_FEATURE=true STEPS=4000000 node index.js 2> OUTPUTDIR/john1_2r_wpc.dump
```

## Create MAME CPU trace file

I use SDLMAME (http://sdlmame.lngn.net/) v0.202.

Reference: https://www.dorkbotpdx.org/blog/skinny/use_mames_debugger_to_reverse_engineer_and_extend_old_games

Copy rom files to `roms` directory.

- start mame with `./mame64 -window -c -debug hurr_l2` (starting hurricane wpc)
- we want to dump all registers, so enter `trace hc_full.txt,0,,{tracelog "CC=%02X A=%04X B=%04X X=%04X Y=%04X S=%04X U=%04X ",cc, a, b, x, y, s, u}`
- run game (F5)
- enter `traceflush` to flush trace file
- enter `trace off` to disable trace

## Diff files

Run `git diff --no-index mame.dump wpcemu.dump`

## How to read

```
CC=50 A=0000 B=0000 X=0000 Y=0000 S=0000 U=0000 8C65: LDA   #$00
CC=54 A=0000 B=0000 X=0000 Y=0000 S=0000 U=0000 8C67: STA   $3FF2
```

- registers are current state
- PC points to next instruction
- OP Codes show NEXT INSTRUCTION

# Statistics

## MAME vs. WPC-EMU 0.7.4, Hurricane (WPC-89)

Both dumps files have a size of 11'625'969 bytes

```
cat huMAME | grep "3FF" | awk '{print $10}' | sort | uniq -c
  11 $3FF2
 142 $3FF4
 119 $3FF6
   1 $3FF8
   6 $3FFA
   6 $3FFB
3557 $3FFC
1223 $3FFD
   2 $3FFE
1261 $3FFF

cat huWPC | grep "3FF" | awk '{print $10}' | sort | uniq -c
 11 $3FF2
136 $3FF4
114 $3FF6
  1 $3FF8
  6 $3FFA
  6 $3FFB
3575 $3FFC
1224 $3FFD
  2 $3FFE
1285 $3FFF
```
Conclusion:
- WPC-Emu and MAME calls a pretty similar

## MAME vs. WPC-EMU 0.7.4, Johnny Mnemonic (WPC-S)

Both dumps files have a size of 81'789'061 bytes

```
# cat jnMAME | grep "3FF" | awk '{print $10}' | sort | uniq -c
  64 $3FF2  # WPC_LEDS
4910 $3FF3  # IRQ ACK?
1812 $3FF4  # WPC_SHIFTADDR
1722 $3FF6  # WPC_SHIFTBIT
 969 $3FF8  # WPC_PERIPHERAL_TIMER_FIRQ_CLEAR
  12 $3FFA  # WPC_CLK_HOURS_DAYS
  32 $3FFB  # WPC_CLK_MINS
17032 $3FFC # WPC_ROM_BANK
3024 $3FFD  # WPC_RAM_LOCK
   4 $3FFE  # WPC_RAM_LOCKSIZE
8780 $3FFF  # WPC_ZEROCROSS_IRQ_CLEAR

# cat jnWPC  | grep "3FF" | awk '{print $10}' | sort | uniq -c
  77 $3FF2  # WPC_LEDS
   2 $3FF3  # IRQ ACK?                          << 2000 times less
1126 $3FF4  # WPC_SHIFTADDR
1056 $3FF6  # WPC_SHIFTBIT
 109 $3FF8  # WPC_PERIPHERAL_TIMER_FIRQ_CLEAR   << 9 times less
   6 $3FFA  # WPC_CLK_HOURS_DAYS
  34 $3FFB  # WPC_CLK_MINS
16219 $3FFC # WPC_ROM_BANK
1928 $3FFD  # WPC_RAM_LOCK
   2 $3FFE  # WPC_RAM_LOCKSIZE
10145 $3FFF # WPC_ZEROCROSS_IRQ_CLEAR
```

Conclusion:
- Major diffs, focus on $3FF3 and $3FF8
