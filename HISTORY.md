# HISTORY

## 10/05/18

- Found the issue why the emu seems to be stuck when using small tickSteps in mainloop. I created a simple Benchmark and added missedIRQ and missedFIRQ to CPU. The Emu starts (although very slow) when using tickSteps of 393, but fails when smaller than 393:

```
BENCHMARK START, ROM: /Users/michaelvogt/_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 20000000 => CPU REALTIME: 10000ms (CPU HZ: 2000000)
	                               durationMs	     tickSteps	  missedIRQ	 missedFIRQ	 ticksExecuted
DURATION_MS_FOR_0xFFFF_CYCLES    1282            1            4425847    4121        20000014
DURATION_MS_FOR_0xFFFF_CYCLES    1194            2            4425847    4121        20000014
DURATION_MS_FOR_0xFFFF_CYCLES    1057            4            3480983    4121        20000014
DURATION_MS_FOR_0xFFFF_CYCLES    990             5            2747650    4121        20000014
DURATION_MS_FOR_0xFFFF_CYCLES    940             8            1961386    4121        20000014
DURATION_MS_FOR_0xFFFF_CYCLES    990             10           1562157    4121        20000014
DURATION_MS_FOR_0xFFFF_CYCLES    983             12           1358921    4121        20000014
DURATION_MS_FOR_0xFFFF_CYCLES    950             16           1028600    4121        20000014
DURATION_MS_FOR_0xFFFF_CYCLES    873             32           547034     4121        20000016
DURATION_MS_FOR_0xFFFF_CYCLES    776             64           267638     4121        20000033
DURATION_MS_FOR_0xFFFF_CYCLES    807             256          44426      4121        20000103
DURATION_MS_FOR_0xFFFF_CYCLES    789             390          17962      4121        20000033
DURATION_MS_FOR_0xFFFF_CYCLES    781             393          17551      4121        20000049
DURATION_MS_FOR_0xFFFF_CYCLES    938             512          6247       1           20000081
DURATION_MS_FOR_0xFFFF_CYCLES    797             1024         17769      0           20000650
DURATION_MS_FOR_0xFFFF_CYCLES    759             2048         8848       0           20000662
DURATION_MS_FOR_0xFFFF_CYCLES    720             4096         4040       0           20003508
DURATION_MS_FOR_0xFFFF_CYCLES    722             8192         1816       0           20002842
DURATION_MS_FOR_0xFFFF_CYCLES    699             16384        700        0           20007527
```

 -> huge missed IRQ (either because pending IRQ or the F_IRQMASK flag is set)

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
