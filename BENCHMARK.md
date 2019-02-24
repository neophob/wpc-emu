# Benchmark

Run `npm run benchmark` to run the CPU benchmark.

## WPC-EMU v0.10.4

### Node v10.11.0

#### MacBook Air, Mid 2012

```
BENCHMARK START, ROM: /Users/michu/_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
  tickSteps	durationMs	missed IRQ	missed FIRQ	ticksExecuted
  1		598		976		854		2000006
  2		288		976		854		2000006
  4		167		976		854		2000006
  5		136		976		854		2000006
  8		196		976		854		2000006
  10		162		976		854		2000006
  12		135		976		854		2000011
  16		110		976		854		2000011
  32		116		976		854		2000029
  64		118		976		854		2000043
  256		116		976		854		2000174
  390		121		976		854		2000207
  393		134		976		854		2000138
  512		114		976		852		2000418
  1024		111		976		427		2000930
  2048		112		976		214		2001113
  4096		117		489		107		2004026
  8192		127		245		54		2007680
  16384		110		123		27		2015481
  32768		112		62		14		2031779
  65536		115		31		7		2031695
```

## WPC-EMU v0.8.10

- used `deoptigate` (https://github.com/thlorenz/deoptigate - `deoptigate test/integration/benchmark.js`) to analyse unoptimised code

### Node v8.11.2

```
BENCHMARK START, ROM: /Users/michaelvogt/_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
  tickSteps	durationMs	missed IRQ	missed FIRQ	ticksExecuted
  1		372		975		0		2000006
  2		133		975		0		2000006
  4		116		975		0		2000006
  5		121		975		0		2000006
  8		123		975		0		2000006
  10		116		975		0		2000006
  12		119		975		0		2000011
  16		115		975		0		2000011
  32		115		975		0		2000029
  64		112		975		0		2000043
  256		115		975		0		2000174
  390		110		975		0		2000207
  393		120		975		0		2000138
  512		114		975		0		2000418
  1024		114		975		0		2000930
  2048		111		975		0		2001113
  4096		111		488		0		2004026
  8192		115		244		0		2007680
  16384		115		122		0		2015481
  32768		116		61		0		2031779
  65536		116		30		0		2031695
```

#### MacBook Pro

### Node v10.1.0

#### MacBook Pro

```
BENCHMARK START, ROM: /Users/michaelvogt/_code/github/wpc-emu/rom.freewpc/ft20_32.rom
Ticks to execute: 2000000 => CPU REALTIME: 1000ms (CPU HZ: 2000000)
  tickSteps	durationMs	missed IRQ	missed FIRQ	ticksExecuted
  1		276		975		0		2000006
  2		220		975		0		2000006
  4		118		975		0		2000006
  5		125		975		0		2000006
  8		114		975		0		2000006
  10		110		975		0		2000006
  12		111		975		0		2000011
  16		110		975		0		2000011
  32		108		975		0		2000029
  64		107		975		0		2000043
  256		108		975		0		2000174
  390		113		975		0		2000207
  393		112		975		0		2000138
  512		107		975		0		2000418
  1024		107		975		0		2000930
  2048		107		975		0		2001113
  4096		106		488		0		2004026
  8192		109		244		0		2007680
  16384		106		122		0		2015481
  32768		111		61		0		2031779
  65536		113		30		0		2031695
```

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
