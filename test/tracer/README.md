# Goal

Create a trace file when starting the emu.

Useful to compare it with a MAME trace.

# Motivation

I could not find a test ROM that validated the CPU for a WPC machine. So the approach
is to dump a MAME ROM and compare the dump with a dump of wpc-emu to find any issues.

## Create MAME trace file

I use SDLMAME (http://sdlmame.lngn.net/) v0.202.

Reference: https://www.dorkbotpdx.org/blog/skinny/use_mames_debugger_to_reverse_engineer_and_extend_old_games

Copy rom files to `roms` directory.

- start mame with `./mame64 -window -c -debug hurr_l2`
- enter `trace trace.txt` into the debug console
- run game (F5)
- enter `traceflush` to flush trace file
- enter `trace off` to disable trace

## Diff files

Run `git diff -w --no-index mame.dump wpcemu.dump`
