# Goal

Create a trace file when starting the emu.

Useful to compare it with a MAME trace.

# Motivation

I could not find a test ROM that validated the CPU for a WPC machine. So the approach
is to dump a MAME ROM and compare that with a dump of wpc-emu to find any issues.

## Options:
- `ROMFILE`: define rom file
- `HAS_SECURITY_FEATURE` if set to true, security pic will be emulated
- `STEPS`: numbers of steps to run

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
