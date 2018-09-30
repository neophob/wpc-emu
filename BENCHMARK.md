# Benchmark

Run `npm run benchmark` to run the CPU benchmark.

## WPC-EMU v0.6.0

- Converted cpu6809 code to a class - needed to have multiple instances of the CPU. This increased the duration to execute 2 million instructions.
- Starting in this version, the CPU Board drives the soundboard - which needs to update a second 6809 CPU.

### Node v8.11.2

#### MacBook Pro

```
BENCHMARK START, ROM: /_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
  tickSteps	durationMs	missed IRQ	missed FIRQ	ticksExecuted
  1		353		975		0		2000001
  2		172		975		0		2000001
  4		120		975		0		2000001
  5		113		975		0		2000001
  8		111		975		0		2000005
  10		111		975		0		2000008
  12		108		975		0		2000001
  16		110		975		0		2000001
  32		105		975		0		2000001
  64		108		975		0		2000033
  256		107		975		0		2000172
  390		106		975		0		2000216
  393		110		975		0		2000128
  512		106		975		0		2000408
  1024		103		975		0		2000964
  2048		111		974		0		2001103
  4096		102		488		0		2004016
  8192		145		244		0		2007691
  16384		106		122		0		2015471
```

#### MacBook Air, Mid 2012

```
BENCHMARK START, ROM: /_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
  tickSteps	durationMs	missed IRQ	missed FIRQ	ticksExecuted
  1		775		975		0		2000001
  2		262		975		0		2000001
  4		199		975		0		2000001
  5		228		975		0		2000001
  8		221		975		0		2000005
  10		214		975		0		2000008
  12		214		975		0		2000001
  16		214		975		0		2000001
  32		209		975		0		2000001
  64		216		975		0		2000033
  256		202		975		0		2000172
  390		251		975		0		2000216
  393		293		975		0		2000128
  512		376		975		0		2000408
  1024		292		975		0		2000964
  2048		516		974		0		2001103
  4096		369		488		0		2004016
  8192		623		244		0		2007691
  16384		621		122		0		2015471

```

### Node v10.1.0

```
BENCHMARK START, ROM: /_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
  tickSteps	durationMs	missed IRQ	missed FIRQ	ticksExecuted
  1		296		975		0		2000001
  2		256		975		0		2000001
  4		124		975		0		2000001
  5		117		975		0		2000001
  8		118		975		0		2000005
  10		116		975		0		2000008
  12		120		975		0		2000001
  16		121		975		0		2000001
  32		118		975		0		2000001
  64		117		975		0		2000033
  256		116		975		0		2000172
  390		115		975		0		2000216
  393		114		975		0		2000128
  512		110		975		0		2000408
  1024		106		975		0		2000964
  2048		109		974		0		2001103
  4096		113		488		0		2004016
  8192		134		244		0		2007691
  16384		137		122		0		2015471
```

## WPC-EMU v0.5.6

### Node v6.9.1

```
BENCHMARK START, ROM: /_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
  tickSteps	durationMs	missed IRQ	missed FIRQ	ticksExecuted
  1		207		975		0		2000001
  2		116		975		0		2000001
  4		104		975		0		2000001
  5		109		975		0		2000001
  8		122		975		0		2000005
  10		102		975		0		2000008
  12		103		975		0		2000001
  16		95		975		0		2000001
  32		97		975		0		2000001
  64		101		975		0		2000033
  256		91		975		0		2000172
  390		96		975		0		2000216
  393		93		975		0		2000128
  512		91		975		0		2000408
  1024		86		975		0		2000964
  2048		79		974		0		2001103
  4096		89		488		0		2004016
  8192		74		244		0		2007691
  16384		74		122		0		2015471
```

### Node v8.11.2

```
BENCHMARK START, ROM: /_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
  tickSteps	durationMs	missed IRQ	missed FIRQ	ticksExecuted
  1		205		975		0		2000001
  2		81		975		0		2000001
  4		77		975		0		2000001
  5		69		975		0		2000001
  8		66		975		0		2000005
  10		65		975		0		2000008
  12		63		975		0		2000001
  16		63		975		0		2000001
  32		68		975		0		2000001
  64		61		975		0		2000033
  256		60		975		0		2000172
  390		63		975		0		2000216
  393		62		975		0		2000128
  512		62		975		0		2000408
  1024		59		975		0		2000964
  2048		59		974		0		2001103
  4096		61		488		0		2004016
  8192		59		244		0		2007691
  16384		60		122		0		2015471
```

### Node v10.1.0

```
BENCHMARK START, ROM: /_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
  tickSteps	durationMs	missed IRQ	missed FIRQ	ticksExecuted
  1		146		975		0		2000001
  2		104		975		0		2000001
  4		81		975		0		2000001
  5		87		975		0		2000001
  8		83		975		0		2000005
  10		81		975		0		2000008
  12		80		975		0		2000001
  16		80		975		0		2000001
  32		81		975		0		2000001
  64		78		975		0		2000033
  256		76		975		0		2000172
  390		79		975		0		2000216
  393		75		975		0		2000128
  512		76		975		0		2000408
  1024		73		975		0		2000964
  2048		71		974		0		2001103
  4096		69		488		0		2004016
  8192		69		244		0		2007691
  16384		72		122		0		2015471
```
