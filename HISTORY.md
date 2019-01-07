# HISTORY

## 7/1/19
- fixed invalid switch state for "High Speed II"

## 29/12/18
- add new game "The Shadow", "Jack·Bot", "Indianapolis 500", "Corvette" and "Red & Ted's Road Show"

## 28/12/18
- add new game "World Cup Soccer", "Junk Yard", "NBA Fastbreak", "The Champion Pub", "Safe Cracker", "Ticket Tac Toe", "SlugFest", "Addams Family Values" and "WHO Dunnit"

## 27/12/18
- add new games "Popeye Saves the Earth", "Judge Dredd", "Demolition Man", "Black Rose", "Bram Stoker's Dracula", "Creature from the Black Lagoon", "No Good Gofers", "Cactus Canyon", "Attack from Mars", "Star Trek: The Next Generation", "Monster Bash", "Tales of the Arabian Nights", "Scared Stiff" and "White Water"
- Top 10 Solid State Pinballs (IPDB.org) are supported now
- do not reset Sound board if no sound board is loaded

## 26/12/18
- add new game "The Flintstones"

## 25/12/18
- add new game "CONGO"

## 16/12/18
- optimise emulator, needs 10-20% less cpu power

## 10/12/18
- web application is now a PWA, caches assets

## 2/12/18
- use memory patcher to skip boot check - make that setting persistent across resets

## 30/11/18
- added missing cycle counts when branch is taken for page 1 calls
- LBSR(0x17) and LBRA(0x16) op, don't sign read word
- fixed invalid .set register case for regPC
- improved cpu test coverage, added DSL tests for CPU opcodes
- NOTE: existing issues (freewpc tests & jm crash still not fixed)

## 26/11/18
- fixed PostByte overflow
- fixed fix a couple of invalid flags (SEX, LDX direct, STX direct, STD direct, LDU direct, STD extended)
- fixed WriteWord and ReadWord overflow

## 25/11/18
- improved mobile view

## 18/10/18
- really fixed bankswitched read (for real!)
- added trace tool/disassembler to compare wpc-emu against mame

## 16/10/18
- really fixed bankswitched read

## 15/10/18
- fixed issue with bankswitched read, now the WPC test ROM runs

## 09/10/18
- Implemented WPC-95 DMD mapping
- Add opto switches config to game libs

## 08/10/18
- write time checksum to RAM, current time is correct now

## 07/10/18
- client works again on old safari browser (ios)

## 06/10/18
- fix dip country selection, twilight zone should work again

## 05/10/18
- security Pic works

## 04/10/18
- option to serve ROM files from localhost

## 01/10/18
- fix dipswitch settings, use USA/CANADA

## 30/09/18
- refactor fliptronics switch input, handled by input switch matrix
- display fliptronics switches in debug ui

## 29/09/18
- support fliptronics switches
- cpu errors now on invalid state - currently more crashes

## 22/09/18
- support more visualisation in games
- fixed dmd reset

![22.09.18](assets/22.09.18.png?raw=true)

## 17/09/18
- implement memory protection
- free wpc games boot now, dmd has still issues

## 07/09/18
- show flasher in client
- use multiple canvas

## 07/09/18
- update ui, add playfield db entry
- show background image
- show lights in client

![25.06.18](assets/25.06.18.png?raw=true)

## 14/06/18
- firq is called on the soundboard, fixed ym2151 setreg call
- relaxed soundboard rom bank switch selection
- i heard sound for about 1s using twilight zone - however it crashed after

## 13/06/18
- fixed missed memory region that we relayed to DMD (0x3C00 - 0x3FAF)
- update docs about soundboard memory mapper
- unconfirmed mapping of the sound cpu system rom to page 0x7f
- add external io controller board
- enhance gamelist

## 06/06/18
- minor progress with the sound board, fixed banked read bug
- simplify cpu reset

## 21/05/18

- cpu6809 is now a class - multiple instances possible
- implement ring buffer for sound data

## 16/05/18

- start refactoring to simplify sound integration
- start sketching the audio interface

## 15/05/18

- start working on the sound board, CPU seems to boot from u18 rom, RAM, ROM and bankswitching seems to work

## 14/05/18

- implement dirty checking for ui elements, no more loud fans when opening the debug view (lower CPU usage)

## 13/05/18

![13.05.18](assets/13.05.18.png?raw=true)

- minor logic change in ui
- implement game specific switch state for a game
- implement game specific initialisation
- add ROM selection to debug ui
- optimise debug ui for mobile app

## 10/05/18

![10.05.18](assets/10.05.18.png?raw=true)

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
- implemented switch matrix input
- fixed dmd page write issue
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
