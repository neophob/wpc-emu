# HISTORY

## 10/05/18

- Found the issue why the Emulator seems to be stuck when using small tickSteps in mainloop. I created a simple Benchmark and added missedIRQ and missedFIRQ counter to the CPU. The Emulator starts (although very slow) when using tickSteps of 393, but fails when smaller than 393:

```
BENCHMARK START, ROM: ./rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
 tickSteps    durationMs    missed IRQ    missed FIRQ    ticksExecuted
  1            215           454452        315            2000002
  2            112           454452        315            2000002
  4            83            338660        315            2000002
  5            94            279857        315            2000002
  8            92            193662        315            2000002
  10           83            157307        315            2000002
  12           81            137554        315            2000007
  16           75            104895        315            2000007
  32           82            54979         315            2000028
  64           79            27299         315            2000031
  256          78            5213          315            2000038
  390          76            2564          315            2000213
  393          78            2521          315            2000253
  512          122           1385          1              2000348
  1024         128           1691          0              2000686
  2048         88            838           0              2001037
  4096         76            368           0              2004049
  8192         65            140           0              2007634
  16384        68            29            0              2015496
```

 -> huge missed IRQ (either because pending IRQ or the F_IRQMASK flag is set). Most missed IRQ calls are because the F_IRQMASK flag was not cleared.
 - fixed invalid counter in emulator main loop, video output improved

## 9/05/18

- Identified source of nasty DMD glitches in faulty FIRQ handling in the wpc functions
- Remove "debug" module from production build -> should speedup a bit

## 8/05/18

- Debug UI use adaptive FPS to stick at 2000ops/ms
- UI Overhaul
- Define Game DB, define url, switch names and more

## 7/05/18

![07.05.18](assets/07.05.18.png?raw=true)

- DMD shading works (2bit aka 4 Colours)
- implemented switch matrix input
- implemented lamp matrix output
- implemented general illumination output,
- debug ui updates (performance improvements, use defined colour schema, rearrange, cleanup)
- use xo/eslint

## 4/05/18

![04.05.18](assets/04.05.18.png?raw=true)

- autorelease cabinet keys after 100ms
- implemented switch matrix input - non working yet
- minor debug ui updates

## 3/05/18

- cabinet keyboard works somehow, implemented inputSwitchMatrix
- fixed emu initialisation - no more waiting until 600M CPU ticks are over!
- update build process (babel minify, prod/dev build, Travis CI)

## 1/05/18

![01.05.18](assets/01.05.18.png?raw=true)

- implement FIRQ source
- update readme
- add more tests
- start working on input matrix

## 30/04/18
- added cycle time to actually copy video buffer scanline per scanline
- fixed DMD FIRQ generation

## 26/04/18

![26.04.18](assets/26.04.18.png?raw=true)

- DMD display works kind of, displays some images
