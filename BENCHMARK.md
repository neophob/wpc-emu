# Benchmark

Run `npm run benchmark` to run the CPU benchmark.

## WPC-EMU v0.5.6

### Node v6.9.1

```
BENCHMARK START, ROM: /Users/michaelvogt/_code/github/wpc-emu/rom.freewpc/ft20_32.rom
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
BENCHMARK START, ROM: /Users/michaelvogt/_code/github/wpc-emu/rom.freewpc/ft20_32.rom
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
BENCHMARK START, ROM: /Users/michaelvogt/_code/github/wpc-emu/rom.freewpc/ft20_32.rom
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
