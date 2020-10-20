# HISTORY

## 20/10/20
- Update database, Fliptronic flipper are NOT closed by default
- fix invalid WPC95_FLIPPER_COIL_OUTPUT asic command - flipper switch triggers a solenoid on WPC95
- FT database, no REEL OPTO is closed by default
- BSD improve closed switches
- TZ/DH add missing fliptronics flipper

## 19/10/20
- Fix invalid WPC95_FLIPPER_COIL_OUTPUT action

## 15/10/20
- Fix Fliptronic Switch issue for WPC95

## 05/08/20
- Add FreeWPC WCS v0.62
- Add FreeWPC Corvette v0.61

## 03/08/20
- Add WPC Alpha: Funhouse (FreeWPC 0.91)
- Add WPC Alpha: Dr. Dude
- Add WPC Fliptronics: The Addams Family
- support uploading WPC Alpha ROM

## 02/08/20
- Add WPC Alpha: WPC test fixture

## 01/08/20
- Fix Load State issue when no saved state was found

## 30/06/20
- Update Game DB

## 29/06/20
- Add more memory positions (WPC-95 and WPC-S)

## 26/06/20
- Added Cabinet colors to database

## 18/06/20
- Scared Stiff - add memory positions

## 15/06/20
- updated deps
- minor layout changes, add link to http://concealed-art.com/

## 13/11/19
- extended API to set defined states for switches (setSwitchInput and setFliptronicsInput)
- new API call to set and read the language DIP setting (getDipSwitchByte, setDipSwitchByte)
- add typescript interface definition

## 17/10/19
- add sanity checks after a gamestate fuzzing test

## 6/10/19
- support alphanumeric display
- support new games: FunHouse, Harley-Davidson and The Machine: Bride of Pin·Bot

![09.10.19](assets/09.10.19.png?raw=true)

## 27/9/19
- fix invalid load state

## 15/9/19
- shrink client database entry

## 10/9/19
- added minimal example
- start working on proper facade for the API

## 9/9/19
- fix missing checksum for freeplay setting
- wpc95: add attract mode sequence number
- improve readability of memory monitor

## 8/9/19
- Add STATISTICS memory position
- Initial Actions: support memory write (freeplay!)

## 7/9/19
- Unify memory position names
- WW add lamps
- Fix toggle Midnight Mode

## 6/9/19
- add sound support to FreeWPC games
- improve T2 audio gain

## 3/9/19
- Support RAM write including checksum, currently supports high score and champion settings

## 2/9/19
- Corvette/T2: support audio
- TOM: add lamps & flasher
- NF/HS2: fix invalid default switches
- NGG: add memory positions

## 1/9/19
- Create docker builder
- add auto generated GAMES.md file - overview about supported games
- add missing playfield images to BR, I500 and NF

## 30/8/19
- Update memory positions for AFM, MM, FT, DM, CONGO, WW
- Improve Memory Monitor visual

## 28/8/19
- expose known RAM state (like current player, current ball..) in UI (and API)

## 26/8/19
- Add memory monitor to UI, reachable via "M" key, "B" and "N" are used to change pages
- support memory debugger (find & patch memory) using JS console, see README

## 19/8/19
- Update Security PIC implementation, fix U22 error (WPC-S Test ROM) and G10 error (WPC95 Test ROM). Use PinMAME implementation with serial number scrambler update. Fixes #31.
- Expose WPC-S Scrambler value in UI

## 11/8/19
- Fix Flipper relay and Coin door relay in UI

## 8/8/19
- Smoother Lamp simulation (Update timing, smooth lamp values)
- Show Flipper relay and Coin door relay in UI
- Implement GI Lamps
- improve emu bundling (emu, webworker, client)
- client run emulator in web worked thread

## 20/5/19
- introducing "Oblivion UI"
- new App icons

![20.05.19](assets/20.05.19.png?raw=true)

## 7/5/19
- re-introduced proper IRQ/FIRQ latching (revert change from 19/1/19)
- do not (manually) clear IRQ/FIRQ CPU flags from ASIC - this crashed for example JM
- track watchdog state

## 6/5/19
- simplify ROM bank R/W

## 5/5/19
- allow write to system rom, MM and MB use this to change reset vector
- fix init CPU

## 30/4/19
- implement blanking LED
- minor UI improvements

![30.04.19](assets/30.04.19.png?raw=true)

## 25/4/19
- Fix White Water DMD flickering (#33) - revert vpinmame DMD flipping
- detect if FIRQ could not be triggered (because of the masking)

## 24/4/19
- Add sound support for Theatre of Magic
- Add sound support for White Water

## 21/4/19
- more sound interface improvements, Ticket Tak Toe does not restart anymore (#30)
- improve PWA caching time

## 15/4/19
- improved DCS sound interface

## 13/4/19
- added option to upload ROM
- fix safe cracker reboot sound board (#30)

## 26/3/19
- disable game specific audio file on mobile - as its just a PITA

## 22/3/19
- Fishtales support sound and music

## 20/3/19
- improve error handling when ROM could not be loaded

## 19/3/19
- do not clear RAM on reset

## 16/3/19
- add lamps to cactus canyon

## 13/3/19
- reflect fliptronics switch state in UI
- bring back the BOING boot sound

## 6/3/19
- add WPC-S testrom, WPC-95 testrom

## 5/3/19
- reflect switch state in UI

## 13/2/19
- cleanup UI
- make sure client works without any active audio file
- save and load sound board state
- get rid of the unused CPU core

![13.02.19](assets/13.02.19.png?raw=true)

## 8/2/19
- remove sound cpu, improve sound interface and forward calls to client
- do not load sound rom's anymore, a audio sample file will be needed
- global volume is know known and exposed to the client, works for preDCS and DCS boards
- use howler to play audio samples
- expose board in each client db entry, needed for the sound board implementation

## 21/1/19
- more keymapping, start game with key "5"
- make sure all games start with closed cabinet key
- fixed more games where the initial switch state was invalid
- get rid of the YM2151 chip, was not working anyway

## 19/1/19
- CPU: do not queue interrupts, fixed JM
- DMD: Change flipping DMD Screens, use same function like vpinmame
- MM: add lamp configuration

## 18/1/19
- STTNG, FT, HS2: use production ROM
- AFM: add lamp configuration
- Client allow step by step processing when PAUSE the emulator multiple times

## 17/1/19
- DMD Ripping: show how many DMD frames has been ripped
- DMD Ripping: increased maximal ripped DMD frames from 1000 to 8000
- DMD Ripping: once 8000 frames has been reached, download dump and continue ripping
- Add more playfield images

## 16/1/19
- add game "Strike Master Shuffle Alley"
- add game "League Champ Shuffle Alley"
- add game "Twilight Zone (FreeWPC), Broken"
- add game "Attack from Mars (FreeWPC), Broken"
- add game "White Water "Bigfoot" (FreeWPC)"
- add game "Demolition Man "Demolition Time" (FreeWPC)"
- add keyboard mapping "1" - "4"

## 14/1/19
- improve error handling when ROM cannot be loaded. Closes GitHub Issue #27 "Prevent crash if the the default rom is missing"

## 13/1/19
- implement keyboard mapping: cabinet service keys ("7", "8", "9", "0"), save and load state ("s", "l"), play and resume ("p", "r")
- option to export DMD frames (VPinMameRawRenderer), can be imported for example in PIN2DMD to colorize DMD animations

## 11/1/19
- implement fliptronics solenoid handling

## 10/1/19
- WPC-Fliptronics: fix Fliptronics Flipper keys, return value need to be inverted
- WPC95: fix Fliptronics Flipper keys, return value need to be inverted

## 8/1/19
- added option to save and load the emulator state (cpu ram, video ram, lamp, switches, solenoids, gi, cpu) of a game
- added option to enable "Midnight Madness Mode", see README.md for more details

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
