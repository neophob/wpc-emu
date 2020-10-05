# WPC Emulator

[![Build Status](https://travis-ci.org/neophob/wpc-emu.svg?branch=master)](https://travis-ci.org/neophob/wpc-emu)

- [WPC Emulator](#wpc-emulator)
  - [Goals](#goals)
- [Implementation Status](#implementation-status)
  - [Basic](#basic)
  - [CPU/ASIC Board](#cpuasic-board)
  - [Power Driver Board](#power-driver-board)
  - [Sound Board](#sound-board)
    - [Pre DCS (A-12738)](#pre-dcs-a-12738)
    - [DCS (A-16917)](#dcs-a-16917)
    - [DCS-95 (A-20516 and A-20145-2)](#dcs-95-a-20516-and-a-20145-2)
  - [Dot Matrix Display/DMD Controller Board](#dot-matrix-displaydmd-controller-board)
  - [Debug UI](#debug-ui)
- [Development](#development)
  - [Serve ROM's from localhost](#serve-roms-from-localhost)
  - [Run Watch](#run-watch)
  - [Tests](#tests)
  - [Benchmark](#benchmark)
  - [Tracer / Dumps](#tracer--dumps)
  - [Build Release](#build-release)
  - [TypeScript](#typescript)
- [Hardware - WPS Dot Matrix Machine](#hardware---wps-dot-matrix-machine)
  - [Overview WPC-89](#overview-wpc-89)
  - [CPU board](#cpu-board)
  - [Power driver board](#power-driver-board-1)
  - [Sound board (pre DCS)](#sound-board-pre-dcs)
  - [DMD board](#dmd-board)
- [Implementation Hints](#implementation-hints)
  - [Timing](#timing)
    - [DMD display scanline](#dmd-display-scanline)
  - [DMD controller](#dmd-controller)
  - [Security PIC (U22)](#security-pic-u22)
  - [Blanking](#blanking)
  - [Audio](#audio)
    - [Build Sound File](#build-sound-file)
  - [RAM / NVRAM positions](#ram--nvram-positions)
    - [Common Variables](#common-variables)
      - [Find Memory positions](#find-memory-positions)
  - [Boot sequence](#boot-sequence)
  - [Gameplay](#gameplay)
  - [To Test](#to-test)
  - [Error Messages](#error-messages)
    - [Invalid Switch state](#invalid-switch-state)
    - [Failed checksum check](#failed-checksum-check)
- [WPC-EMU Manual](#wpc-emu-manual)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Debug ROM](#debug-rom)
    - [Advanced example: "find RAM location of current credits"](#advanced-example-find-ram-location-of-current-credits)
  - [Midnight Madness Mode](#midnight-madness-mode)
  - [Rip DMD Animation](#rip-dmd-animation)
    - [Intro](#intro)
    - [First load up the desired ROM in the drop down in the top left.](#first-load-up-the-desired-rom-in-the-drop-down-in-the-top-left)
    - [Insert coin(s) and hit the start button to begin a game](#insert-coins-and-hit-the-start-button-to-begin-a-game)
    - [Prepare to dump](#prepare-to-dump)
    - [Begin to dump](#begin-to-dump)
    - [Fire the animation(s)](#fire-the-animations)
    - [Save the dump](#save-the-dump)
- [References](#references)
  - [Terms](#terms)
  - [ROM Revision / Software Version Information](#rom-revision--software-version-information)
  - [WPC](#wpc)
  - [Pinball 2000](#pinball-2000)
  - [DMD](#dmd)
  - [CPU](#cpu)
  - [Security Chip](#security-chip)
  - [Sound Chip](#sound-chip)
  - [ROM](#rom)
  - [Custom Power Driver](#custom-power-driver)
  - [Misc](#misc)
- [Game List](#game-list)
  - [WPC (Alphanumeric)](#wpc-alphanumeric)
  - [WPC (Dot Matrix)](#wpc-dot-matrix)
  - [WPC (Fliptronics)](#wpc-fliptronics)
  - [WPC (DCS)](#wpc-dcs)
  - [WPC-S (Security)](#wpc-s-security)
  - [WPC-95](#wpc-95)

## Goals

- Preserve the "old" Williams/Bally/Midway pinball games
- Help debugging real world pinball issues
- have fun explore the games, try to crash them etc.
- Run a Twitter Bot, play games and print nerd statistics: https://twitter.com/WPCPinball

```
___        ___   ___
\_ \/\____/   \_/   \  zS!  ___   /\_______
/  / /  /  ___/  /__/ _   _/_  \_/__\__ \_ \/\_
¯\_____/¯\/   ¯\___/ \// /  /__/  /  /  /  /  /
                        ¯\___/¯\/__/__/¯\___/
```

# Implementation Status

Reference: http://bcd.github.io/freewpc/The-WPC-Hardware.html#The-WPC-Hardware

## Basic
- read Game ROM file ✓
- read Sound ROM file ✓
- emulate 6809 CPU ✓

## CPU/ASIC Board
- Blanking ✓
- Diagnostics LED ✓
- Watchdog ✓ (reboot is not triggered!)
- Bit Shifter ✓
- Memory Protection ✓
- Time of Day Clock ✓
- High Resolution Timer ✗ (not used, was used by alphanumeric games to do display dimming)
- ROM Bank Switching ✓
- RAM Bank Switching ✗ (WPC 95 only, not sure if needed, MAME does not implement it)
- The Switch Matrix ✓
- External I/O ✓ (except sound)
- Fliptronics Flipper ✓
- Interrupt Reset ✓
- Interrupt IRQ ✓
- Interrupt FIRQ ✓ (incl. source - not sure if needed)
- Security Chip ✓

## Power Driver Board
- Lamp Circuits ✓
- Solenoid Circuits ✓ (fade out timing missing)
- General Illumination Circuits (Triac) ✓ (fade out timing missing)
- Zero Cross Circuit ✓
- support Fliptronics flipper ✓

## Sound Board
- Bank Switching ✗ (Not needed, sound generation exposed to client)
- Resample audio to 44.1khz ✗ (Not needed, sound generation exposed to client)
- emulate 6809 CPU ✗ (Not needed, sound generation exposed to client)
- emulate DAC ✗ (Not needed, sound generation exposed to client)
- simulate sound board and forward each event (play sample, volume..) to the client ✓

### Pre DCS (A-12738)
- 17 Games use this board
- load pre DCS sound ROM files ✗
- emulate YM2151 FM Generator ✗
- emulate HC-55536 CVSD ✗ (speech synth)
- emulate MC6821 PIA ✗

### DCS (A-16917)
- 19 Games use this board
- load DCS sound ROM files ✗
- emulate Analog Devices ADSP2105, clocked at 10 MHz, DMA-driven DAC, outputting in mono ✗

### DCS-95 (A-20516 and A-20145-2)
- 15 Games use this board
- compared to A-20516, this board allows for 16MB of data instead of 8MB to be addressed ✗

## Dot Matrix Display/DMD Controller Board
- Page Selection ✓
- Scanline Handling ✓
- Dimming / multi color display ✓
- WPC 95 support ✓
- ColorDMD support ✗

## Debug UI
- DMD output ✓
- VideoRAM output ✓
- Debug KPI ✓
- Cabinet input keys work ✓
- Switch input keys work ✓
- Fliptronics input keys work ✓
- Adaptive FPS ✓
- Debug interface ✗ (Step, Breakpoint, disassembler)

# Development

## Serve ROM's from localhost
You can run a local fileserver to serve the needed WPC ROM files.
- create the `./rom` directory and copy your ROM files (program and audio) to this directory
- You need to create and install a local certificate (needed to support https), read the file `assets/localhost-cert/README.md`
- To install dependencies run `npm install` in root and `./client` directory
- Run `npm run start:fileserv` to start local file serve (in a separate window)

## Run Watch
Use the watch functions to automatically compile changes in the client and server directories.
- Run `npm run watch` in the root directory and the `./client` directory
- Open `https://127.0.0.1:8080/index.html` to run WPC-EMU

## Tests
- Run `npm run test` to run library unit tests
- Run `npm run test:integration` to run the integration test
- Run `npm run test` in the client directory to run client unit tests

## Benchmark
To verify the current implementation is not slower than an older version you can run the integrated benchmark.
Make sure to run the benchmarks using the same node versions.
- Run `npm run benchmark` to run the small benchmark (1s on the emulator), this target uses the included FreeWPC T2 ROM
- Run `npm run benchmark:t2` to run the longer benchmark, you need to have the T2 rom in the roms directory

Sidenote: Also using deoptigate (https://github.com/thlorenz/deoptigate) shows where the code is unoptimised.

## Tracer / Dumps
The `wpc-emu-dumps` directory contains game dump files and can be used to compare the current implementation
against older implementations. It also contains MAME dumps to compare the current WPC-EMU implementation against other emus.
- Run `npm run tracer:dump` to dump game state to disk
- Run `npm run tracer:status` or `npm run tracer:diff` to compare current implementation against an older implementation
- Run `npm run tracer:stats` to compare WPC-EMU against MAME implementation

## Build Release
To build a new release:
- Build release branch (git flow)
- Bump `package.json` version in the root directory and the `./client` directory
- Run `npm run release` in the root directory
- output is available in the `./dist` directory, final assets for github is in the `./docs` directory
- Make sure unit tests and integration tests still pass
- Optional: Run tracer dumps to compare against older implementations
- merge release branch

## TypeScript

WPC-Emu supports ts definition at the API level, take a look at the `types` root directory.

## Ports

- https://github.com/jsm174/wpc-emu-cs/

# Hardware - WPS Dot Matrix Machine

## Overview WPC-89

```

    +-----------------------+   +-------------------------+
    |                       |   |                         |
    |  CPU BOARD / A-12742  |   |  SOUND BOARD / A-12738  |
    |                       |   |           (DCS A-16917) |
    |  -------------------  |   |  ---------------------  |
    |                       |   |                         |
    |  - MC 6809 CPU@2MHz   |   |  - MC 6809 CPU@2MHz     |
    |  - WPC ASIC           |   |  - YM2151 FM            |
    |  - 1 Game ROM         |   |  - HC-55536 CVSD        |
    |  - 8kb RAM            |   |  - MC 6809 PIA          |
    |                       |   |  - 3 Sound ROMs         |
    |                       |   |  - DAC                  |
    |                       |   |  - 8kb RAM              |
    |                       |   |                         |
    +-----------------------+   +-------------------------+

    +-----------------------+
    |                       |
    |  DMD BOARD / A-14039  |
    |  -------------------  |
    |                       |
    |  - 8kb RAM            |
    |                       |
    +-----------------------+

```

Operating system:
- APPLE OS (created by Williams, not related to the company Apple, but "Advanced Pinball Programming Logic Executive")
- Part of the game ROM, last 32kb of the game ROM

## CPU board
- Williams part number A-12742
- Main CPU: Motorola 6809 (68B09E) at 2 MHz, 8-bit/16-bit CPU and between 128KB and 1MB of EPROM for the game program
- Total 8KB RAM, battery-backed, format is Big Endian
- Custom ASIC chip by Williams, mainly a huge mapper
- Its memory address space is 64 KiB (linear $0000 to $FFFF, 16Bit address)
- Can address 8KB RAM, 8KB Hardware, 16KB Bank switched Game ROM, 32KB System ROM
- Game ROM name: U6

## Power driver board
- Williams part number: A-12697-1

## Sound board (pre DCS)
- Williams part number: A-12738 (aka. pre-DCS sound)
- Mono output, Sample rate 11KHz, 25 watts power, 8 ohm
- intelligent and have processors running their own operating system dedicated to sound tasks
- CPU: Motorola 6809 (MC68A09EP), frequency 2MHz
- OPM: Yamaha YM2151 OPM (FM Operator Type-M), frequency 3.579545MHz (8-voice FM sound synthesiser)
- DAC: AD-7524 (Digital Analog converter) and YM3012
- Harris HC-55536 CVSD (Continuously variable slope delta modulation). Note HC-55536 is pin compatible with 55516 and 55564.
- MC6821 Peripheral Interface Adaptor (PIA)
- ROMS: U14, U15 and U18

## DMD board
- Williams part number A-14039
- The dot matrix display is 128 columns x 32 rows and refreshes at 122Mhz
- The controller board has the display RAM and the serialisation logic
- The display RAM holds 8KB. A full DMD bit plane requires 128x32 pixels, that is, 4096 bits, or 512 bytes. Thus, there is enough RAM to hold a total of 16 planes. At any time, at most two planes can be addressed by the CPU

# Implementation Hints

- if memory map (Systemrom) contains `0x00` at `0xFFEC` and `0xFF` at `0xFFED` then the startup check will be disabled. This reduce the boot time and works on all WPC games (not on FreeWPC games)
- There is ONE switch in all WPC games called "always closed" (always switch 24 on all WPC games). This switch is used to detect if the switch matrix is faulty. This means if switch 24 is open, the system knows the switch matrix is faulty.

## Timing
- CPU run at 2 MHZ, this means 2'000'000 clock ticks/s -> The CPU execute 2 cycles per us.
- CPU IRQ is called 976 times/s, that a IRQ call each 1025us
- ZeroCross should occur 120 times per second (NTSC running at 60Hz), so each 8.3ms. (8.3 * 2000cycles/ms = 16667 ticks)

Timings are very tight, we cannot use `setTimeout`/`setInterval` to call for example the IRQ. So the main idea is to run one
main loop that executes some CPU ops then check if one of the following callbacks need to be triggered:
- each 2049 ticks call IRQ (1025us)
- each 16667 ticks update ZeroCross flag (8.3ms)
- each 512 ticks update display scanline (256us)

### DMD display scanline
The controller fetches 1 byte (8 pixels) every 32 CPU cycles (16 microseconds). At this rate, it takes 256 microseconds per row and a little more than 8 milliseconds per complete frame.

## DMD controller

WPC-89 exposes two memory regions (length 0x200 bytes) to write to the video ram:
- `0x3800 - 0x39FE` for bank 1
- `0x3A00 - 0x3BFF` for bank 2

WPC-95 added four CPU accessible video ram pages:
- `0x3000 - 0x31FF` for bank 3
- `0x3200 - 0x33FF` for bank 4
- `0x3400 - 0x35FF` for bank 5
- `0x3600 - 0x37FF` for bank 6

Each bank can point to an individual address to one of the 16 video ram pages.

TODO: I could not find a game that uses those additional video ram pages yet!

## Security PIC (U22)
FreeWPC documentation about this security feature:

```
A security PIC chip is added between the ASIC and the switch matrix
inputs.  The CPU no longer reads the switch data directly; it sends
commands to the PIC which then reads the data.  The PIC requires some
special cryptic codes to be sent otherwise it will not return valid
switch data, making the game unplayable.
```
- If the security chip implementation is invalid, the DMD display will show "U22 ERROR" or "G10 ERROR" (WPC95)
- If the security chip works but does not match the expected Pinball model, the DMD will show "Incorrect U22 for this game" or "Incorrect G10 for this game"

WPC-EMU uses the technique by Ed Cheung (http://www.edcheung.com/album/album07/Pinball/wpc_sound2.htm)
to bypass the Security PIC:

```
The ROM is searched sequentially for "EC 9F xx yy 83 12 34".  This is a
pattern that marks the address of a pointer to the location of the game ID.
at this location there is a 2 byte number which is the game id
```
**NOTE**: this works only for WPC games but NOT for FreeWPC games!

The file `rom/game-id.js` searches the ROM for the (unique) game ID. This id is later patched
(using the memory patch function) with the game ID of Medieval Madness (Game ID: 559). Examples:

- Dirty Harry (530) game ID is stored at location 0xE873 and contains 0xE8/0x73
- Medieval Madness (559) game ID is stored at location 0xE885 and contains 0xE8/0x85
- No Fear (525) game ID is stored at location 0xE80D and contains 0xE8/0x0D

Here is a debug log of "Dirty Harry" ROM booting and the read the game ID. The pointer to the game ID location
is stored at 0x81C9/0x81CA (16 bit) for this game.

```
2018-10-04T21:33:43.053Z wpcemu:boards:cpu-board mem-read 81c9
2018-10-04T21:33:43.053Z wpcemu:boards:cpu-board mem-read 81ca
2018-10-04T21:33:43.053Z wpcemu:boards:cpu-board read securityPic machine id
2018-10-04T21:33:43.053Z wpcemu:boards:cpu-board mem-read e873
2018-10-04T21:33:43.053Z wpcemu:boards:cpu-board mem-read e874
```

## Blanking

Blanking protects the hardware on the pinball machines when booting. As soon as the system is ready, blanking is disabled (D19).

I **assume** that the blanking signal is reset periodically with the `WPC_ZEROCROSS_IRQ_CLEAR` call.

I only implemented the initial HIGH (enabled) to LOW (disabled) transition, re - enabling the blanking signal is NOT implemented.

## Audio
The soundboard works independent from the main board and the communication between the CPU board and Sound board is rather simple, just a 8 or 16 bit command is send to the sound board, then the sound board will play that specific number.

Note: The boot up BONG sound is not generated by the sound board but the CPU board.

As there are 3 different sound boards are available, the implementation would take a lot of time, that's why the first implementation expose the play command to the frontend, the frontend plays the specific sample.

There are different audio types available (Thanks @sker65):
- **background music**: plays as long the file lasts (optional timeout or looping)
- **sound effect**: is mixed to background music
- **voice callout**: is mixed to background music.
- **jingle**: is mixed but background music is paused or lowered, then resumed
- **single**: as jingle but no resume, background music stops after single

I *assume* there can be only one active sound per audio type.

There are also some sound effects that contain two samples, not sure yet if the play sequentially ot alternated.

| Model           | Mono/Stereo | Sample rate | Channels | Interface | Read control register |
| --------------- | ----------- | ----------- | -------- | --------- | --------------------- |
| DMD / A-12738   | Mono 1.0    | 11kHz       | ??       | 8 bit     | false                 |
| DCS / A-16917   | Mono 1.1    | 32kHz       | 4        | 16 bit    | false                 |
| WPC95 / A-20516 | Mono 1.1    | 32kHz       | 6        | 16 bit    | true                  |

### Build Sound File

WPC-EMU uses a audio sprite - one large audio file and a description where a sample is in this file and how long it takes to play this sample. Reason for that is, that a single file needs to be downloaded instead more than 200 files.

To rip sound samples of a ROM, use M1 (http://rbelmont.mameworld.info/?page_id=223). Also take look at this little tutorial https://www.vpforums.org/index.php?app=tutorials&article=54 how to rip the samples.

Once you ripped all samples, they need to be combined into one file using audiosprite (https://github.com/tonistiigi/audiosprite).

Example output for Fish Tales Sound files:

```
# audiosprite -e mp3,webm,ogg -f howler -v 5 $(find . -name '*.wav' -exec echo {} +)
   9,2K  1 Feb 13:04 output.json
    22M  1 Feb 13:11 output.mp3
    36M  1 Feb 13:12 output.ogg
    35M  1 Feb 13:11 output.webm

```

Make sure to checkout the `assets/soundripper` tool, to generate the soundsprite file:

```
# node index.js /path/fileWithSoundFiles
```

## RAM / NVRAM positions

Known RAM positions for WPC games.

| Offset          | Comment        |
| --------------- | -------------- |
| 0x0011          | Current Bank Marker, ??  |
| 0x0012          | Bank Jump Address hi, ??  |
| 0x0013          | Bank Jump Address lo, ??  |
| 0x16A1          | NVRAM starts |
| 0x1800          | Date, Year hi  |
| 0x1801          | Date, Year lo  |
| 0x1802          | Date, Month (1-12) |
| 0x1803          | Date, Day of month (1-31) |
| 0x1804          | Date, Days or week (0-6, 0=Sunday) |
| 0x1805          | Date, Hour (0-23) |
| 0x1806          | Date, isValid (1) or isInvalid(0)  |
| 0x1807          | Date, Checksum hi (time) |
| 0x1808          | Date, Checksum lo (date) |
| 0x180C          | Game ID as String |
| 0x1811-0x2000   | Game specific settings (HSTD, timestamps, adjustments, audits, language, volume, custom message...) |
| 0x2FFF          | NVRAM ends |

Note:
- The initial memory check writes from offset `0x0000 - 0x1730`, so stored NVRAM data might be stored above `0x1730` (Probably depends on the game)
- see - https://github.com/tomlogic/pinmame-nvram-maps for NVRAM dumps of WPC games

### Common Variables

WPC-EMU implements specific memory parsing (supports uint8, uin16, uint32, bcd and string encoding), see `memoryPosition` entries in client db. NVRAM settings are protected by a checksum which will be automatically updated if the checksum type and range is known.

HINT: To find the checksum range, try to modify the first setting per section (for example balls per game) - then you will see that there is a checksum range that will modify (2 bytes, checksum is 0xFFFF - sum of bytes).

Mapping of memory position use common names to identify a specific value:
- `GAME_`: Game specific information
- `STAT_`: Machine specific statistics
- `HISCORE_`: All kind of high score values

#### Find Memory positions

- use `wpcInterface.memoryFindData(value, encoding, optionalRememberResults)` to search the memory for data. Supported encodings: `string`, `uint8`, `uint16`, `uint32` and `bcd`. If `optionalRememberResults` is set to true, a subsequent call search only through previous results. This is handy if you are searching for a specific value.
- use `wpcInterface.memoryDumpData(OFFSET, optionalEndOffset)` to dump memory
- use `wpcInterface.writeMemory(offset, value)` to modify the memory (write a byte)

Examples:
- highscore name: search for string "DEN": `wpcInterface.memoryFindData('DEN', 'string')`
- highscore score: search for score "20,000,000": `wpcInterface.memoryFindData('20000000', 'bcd')`
- game credits: search for `wpcInterface.memoryFindData(0, 'uint8', true)`, insert credits (press `2`), search again `wpcInterface.memoryFindData(1, 'uint8', true)`and repeat!
- validate that your attract sequence setting is correct: `wpcInterface.writeMemory(0x589, 3)` - this should modify the display setting of the attract mode

## Boot sequence

I found an analysis of the boot up sequence here: https://gist.github.com/74hc595/fda8b274179fea633f5333d52513e1f7. Here's the annotated code:

```
; bootup sequence from a Williams WPC pinball machine ROM
; (Getaway version L-2)
; Last 32K of ROM image in 0x8000-0xFFFF
; Banked ROM in 0x4000-0x7FFF
; RAM is 0x0000-0x1FFF
; Special ASIC registers are 0x3Fxx (e.g. 3FF2 controls LED D20)
; Reset vector is 0x8C9A

dasm09: M6809/H6309/OS9 disassembler V0.1 2000 Arto Salmi
; org $8C9A
RESET:
8C9A: 1A 50          ORCC #$50      ;disable interrupts (FIRQ & IRQ)
8C9C: 86 00          LDA #$00
8C9E: B7 3F F2       STA $3FF2      ;diagnostic LED off
8CA1: 10 8E 00 06    LDY #$0006
8CA5: 5F             CLRB
8CA6: BE FF EC       LDX $FFEC      ;read 2-byte checksum "correction" from ROM
8CA9: 8C 00 FF       CMPX #$00FF    ;if it's 0x00FF, skip ROM/RAM checks
8CAC: 10 27 01 03    LBEQ PASSED ;$8DB3
8CB0: CE 00 3F       LDU #$003F
8CB3: CC 00 00       LDD #$0000
8CB6: 1E 03          EXG D,U        ;U=0x0000, D=0x003F.

; Compute checksum of all ROM banks and verify
L1:
8CB8: 1F 98          TFR B,A        ;bank loop start
8CBA: 43             COMA
8CBB: 85 07          BITA #$07
8CBD: 26 0A          BNE $8CC9
8CBF: 43             COMA
8CC0: 4A             DECA
8CC1: B7 3F FC       STA $3FFC      ;store A to bank switch register (WPC_ROM_BANK)
8CC4: B1 40 00       CMPA $4000     ;compare A with lowest byte in bank (0x20, 0x21, ...)
8CC7: 26 3E          BNE $8D07      ;stop if comparison fails
8CC9: F7 3F FC       STB $3FFC      ;store B to bank switch register (WPC_ROM_BANK)
8CCC: 1E 03          EXG D,U        ;bring checksum back to D
8CCE: B7 3F DD       STA $3FDD      ;sound board something? (WPC_SOUND_CONTROL_STATUS)
8CD1: 8E 40 00       LDX #$4000     ;initialize X pointer to start of bank
L2:
8CD4: EB 84          ADDB ,X        ;Add 8 bytes to checksum in D
8CD6: 89 00          ADCA #$00
8CD8: EB 01          ADDB 1,X
8CDA: 89 00          ADCA #$00
8CDC: EB 02          ADDB 2,X
8CDE: 89 00          ADCA #$00
8CE0: EB 03          ADDB 3,X
8CE2: 89 00          ADCA #$00
8CE4: EB 04          ADDB 4,X
8CE6: 89 00          ADCA #$00
8CE8: EB 05          ADDB 5,X
8CEA: 89 00          ADCA #$00
8CEC: EB 06          ADDB 6,X
8CEE: 89 00          ADCA #$00
8CF0: EB 07          ADDB 7,X
8CF2: 89 00          ADCA #$00
8CF4: 1E 20          EXG Y,D
8CF6: F7 3F FF       STB $3FFF      ;pet the watchdog
8CF9: 1E 20          EXG Y,D
8CFB: 30 08          LEAX 8,X       ;advance X 8 bytes
8CFD: 8C 80 00       CMPX #$8000    ;are we at the end of the bank?
8D00: 25 D2          BCS L2;$8CD4   ;if not, check more bytes
8D02: 1E 03          EXG D,U
8D04: 5A             DECB           ;next bank
8D05: 20 B1          BRA L1 ;$8CB8

8D07: 1E 03          EXG D,U        ;bring checksum to D
8D09: B3 FF EE       SUBD $FFEE     ;compare with stored value at 0xFFEE-0xFFEF
8D0C: 27 02          BEQ $8D10
8D0E: C6 01          LDB #$01       ;if checksum compare fails, set B=1
8D10: 1F 02          TFR D,Y        ;low byte of Y is now 0x01 if ROM test failed

; Verify working RAM (leaves adjustments/audits alone)
; Writes 0x55 to 0x0000-0x172F, then verifies,
; then writes 0xAA to 0x0000-0x172F and verifies again
8D12: C6 06          LDB #$06
8D14: 86 B4          LDA #$B4
8D16: B7 3F FD       STA $3FFD      ;unlock protected memory with magic value 0xB4 (WPC_RAM_LOCK)
8D19: 86 01          LDA #$01
8D1B: B7 3F FE       STA $3FFE      ;something something memory protection (WPC_RAM_LOCKSIZE)
8D1E: B7 3F FD       STA $3FFD      ;write WPC_RAM_LOCK
8D21: 86 55          LDA #$55       ;initialize A with 0x55

8D23: 8E 00 00       LDX #$0000     ;initialize X pointer to start of RAM
L3:
8D26: A7 84          STA ,X         ;store 0x55 in 4 bytes
8D28: A7 01          STA 1,X
8D2A: A7 02          STA 2,X
8D2C: A7 03          STA 3,X
8D2E: F7 3F FF       STB $3FFF      ;pet watchdog WPC_ZEROCROSS_IRQ_CLEAR
8D31: 30 04          LEAX 4,X       ;advance X by 4 bytes
8D33: 8C 17 30       CMPX #$1730    ;stop at 0x1730 (start of persistent values?)
8D36: 25 EE          BCS L3 ;$8D26

8D38: 8E 00 00       LDX #$0000     ;reset X to start of RAM
L4:
8D3B: A1 84          CMPA ,X        ;compare 4 bytes with 0x55
8D3D: 26 21          BNE $8D60      ;if any mismatch, bail
8D3F: A1 01          CMPA 1,X
8D41: 26 1D          BNE $8D60
8D43: A1 02          CMPA 2,X
8D45: 26 19          BNE $8D60
8D47: A1 03          CMPA 3,X
8D49: 26 15          BNE $8D60
8D4B: F7 3F FF       STB $3FFF      ;pet watchdog (WPC_ZEROCROSS_IRQ_CLEAR)
8D4E: 30 04          LEAX 4,X       ;advance X by 4 bytes
8D50: 8C 17 30       CMPX #$1730    ;stop at 0x1730
8D53: 25 E6          BCS L4 ;$8D3B

8D55: 81 55          CMPA #$55      ;after testing with 0x55,
8D57: 26 03          BNE $8D5C
8D59: 43             COMA           ;test again with 0xAA
8D5A: 20 C7          BRA $8D23

8D5C: 1F 20          TFR Y,D        ;bring test results in Y back to D
8D5E: 20 04          BRA $8D64
; ram test fail
8D60: 1F 20          TFR Y,D        ;bring test results in Y back to D
8D62: CA 02          ORB #$02       ;or with 0x02 if RAM test failed
8D64: 5D             TSTB           ;if nothing has failed so far,
8D65: 27 4C          BEQ PASSED ;$8DB3  ;test has finished
8D67: 1F 03          TFR D,U        ;stash D in U

; something has failed, blink diagnostic LED
8D69: 86 80          LDA #$80       ;LED on
8D6B: B7 3F F2       STA $3FF2
8D6E: B7 3F DD       STA $3FDD      ;sound board something? (WPC_SOUND_CONTROL_STATUS)
8D71: 8E FF FF       LDX #$FFFF     ;initialize delay counter
8D74: 86 06          LDA #$06
DELAY1:
8D76: B7 3F FF       STA $3FFF      ;pet watchdog (WPC_ZEROCROSS_IRQ_CLEAR)
8D79: 30 01          LEAX 1,X       ;waste some cycles
8D7B: 30 1F          LEAX -1,X
8D7D: 30 1F          LEAX -1,X
8D7F: 26 F5          BNE DELAY1 ;$8D76
8D81: 86 00          LDA #$00       ;LED off
8D83: B7 3F F2       STA $3FF2      ;WPC_LEDS
8D86: 8E FF FF       LDX #$FFFF     ;initialize delay counter
8D89: 86 06          LDA #$06
DELAY2:
8D8B: B7 3F FF       STA $3FFF      ;pet watchdog (WPC_ZEROCROSS_IRQ_CLEAR)
8D8E: 30 01          LEAX 1,X       ;waste some cycles
8D90: 30 1F          LEAX -1,X
8D92: 30 1F          LEAX -1,X
8D94: 26 F5          BNE DELAY2 ;$8D8B

8D96: 54             LSRB           ;shift out a bit from B
8D97: 24 D0          BCC $8D69      ;if C=0 then ROM was good, blink again
; pause
8D99: C6 04          LDB #$04
8D9B: 86 06          LDA #$06
DELAY3:
8D9D: 8E C0 00       LDX #$C000     ;delay loop
DELAY4:
8DA0: B7 3F FF       STA $3FFF      ;pet watchdog (WPC_ZEROCROSS_IRQ_CLEAR)
8DA3: B7 3F DD       STA $3FDD      ;sound board something? (WPC_SOUND_CONTROL_STATUS)
8DA6: 30 1F          LEAX -1,X
8DA8: 26 F6          BNE DELAY4     ;$8DA0
8DAA: 5A             DECB
8DAB: 26 F0          BNE DELAY3     ;$8D9D
8DAD: 1F 30          TFR U,D
8DAF: C5 02          BITB #$02      ;if bit 1 set in test result byte...
8DB1: 26 FE          BNE $8DB1      ;loop forever, watchdog will reset machine

; ROM and RAM tests have passed
; System should boot correctly if we get here
PASSED:
8DB3: 1A 50          ORCC #$50      ;disable interrupts (FIRQ & IRQ)
8DB5: 10 CE 04 00    LDS #$0400     ;initialize stack pointer
8DB9: BD 92 F5       JSR $92F5
8DBC: F7 17 4D       STB $174D
8DBF: 7F 17 48       CLR $1748
8DC2: 7F 17 A3       CLR $17A3
8DC5: 7F 17 4A       CLR $174A
8DC8: 7F 17 4B       CLR $174B
8DCB: 7F 17 4C       CLR $174C
8DCE: 20 0E          BRA $8DDE
8DD0: 1A 50          ORCC #$50      ;disable interrupts (FIRQ & IRQ)
8DD2: 86 01          LDA #$01
8DD4: B7 17 4C       STA $174C
8DD7: 10 CE 04 00    LDS #$0400
8DDB: BD 92 F5       JSR $92F5
8DDE: 10 CE 17 2A    LDS #$172A
8DE2: 4F             CLRA
8DE3: 1F 8B          TFR A,DP
8DE5: 8E 00 00       LDX #$0000

; loop.. delay?
8DE8: 6F 80          CLR ,X+
8DEA: 86 06          LDA #$06
8DEC: B7 3F FF       STA $3FFF      ;write to WPC_ZEROCROSS_IRQ_CLEAR
8DEF: 8C 17 30       CMPX #$1730
8DF2: 25 F4          BCS $8DE8

8DF4: BD 91 C0       JSR $91C0
8DF7: BD 9E E5       JSR $9EE5
8DFA: BE 17 48       LDX $1748      ;check against memory position 0x1748
8DFD: 8C 1A BC       CMPX #$1ABC
8E00: 27 1B          BEQ $8E1D
8E02: B6 17 4C       LDA $174C
8E05: 27 08          BEQ $8E0F
8E07: 7F 17 4A       CLR $174A
8E0A: 7F 17 4B       CLR $174B
8E0D: 20 1C          BRA $8E2B
8E0F: BD 89 04       JSR $8904
8E12: 59             ROLB
8E13: 3E             RESET
8E14: 39             RTS
8E15: BD 89 04       JSR $8904
8E18: 55             Invalid
```
I guess there is one error, the comment `loop forever, watchdog will reset machine`:
- it's not the watchdog that will reset the machine but an interrupt call

## Gameplay
- (during active game) if you press and keep pressed left or right FLIPPER - a status report will be shown
- the TROUGH switches need to be closed to be able to start the game, else you see the "Pinball missing messages" -> these switches are used to detect that there are still balls in the TROUGH - depending on the model there are more or less ball and switches available
- the OUTHOLE is off when the game starts

TODO:
OUTHOLE ON, TROUGH 1 ON, OUTHOLE OFF, TROUGH 1 OFF

This very primitive schema shows where the switches are:
- 1: OUTHOLE SWITCH
- 2,3,4: TROUGH SWITCHES
```
   +--------------+
   |              |
   |              |
   |              |
   |   \      /   |
   |              |
   |      1  234  |

```

## To Test
- serial port?

## Error Messages

### Invalid Switch state

Error message:
- `check fuses f101 and f109, j127 and opto 12v supply`
- `check fuses f115 and f116, j112 and opto 12v supply`

Solution:
- check the initial switch state, possible that a switch is in the wrong state
- NOTE: opto switches are closed in the initial state!

### Failed checksum check

If the `skipWpcRomCheck` is set to false, you see this error on some machines (dh, mm):

- `G11 CKSUM ERROR` (WPC-95)
- `U6 CKSUM ERROR` (WPC-S)

Issue: ROM checksum invalid

Solution: Stored checksum in ROM and actual computed checksum invalid, unclear why and what regions are used to calculate the checksum. Needs more investigation, see #37

# WPC-EMU Manual

## Keyboard Shortcuts

| Key | Function                   |
| --- | -------------------------- |
| 1   | Coin#1                     |
| 2   | Coin#2                     |
| 3   | Coin#3                     |
| 4   | Coin#4                     |
| 5   | Start Game                 |
| P   | Pause Game                 |
| R   | Resume Game / Step by Step |
| L   | Load Game state            |
| S   | Pause Game state           |
| 7   | Coin menu Escape           |
| 8   | Coin menu -                |
| 9   | Coin menu +                |
| 0   | Coin menu Enter            |
| M   | Opens the Memory monitor   |
| B   | Memory monitor, next page  |
| N   | Memory monitor, prev page  |

## Debug ROM

WPC-EMU exposes the memory monitor to analyse the RAM of a running ROM. WPC-EMU also exposes its core functions in the JS console. API description:

```
/**
 * Write directly to emulator memory
 * @param {Number} offset where to write
 * @param {Number|String} value String or uint8 value to write
 * @param {Boolean} block optional option (default is false) to persist stored data
 */
function writeMemory(offset, value, block)

/**
 * Find data in emulator memory
 * @param {Number|String} value the value you are looking for
 * @param {String} encoding type of search, can be 'string', uint8, uint16
 * @param {Boolean} rememberResults only uint8 supported, remembers all the positions from a previous search
 */
function memoryFindData(value, encoding, rememberResults = false)

/**
 * Print emulator memory content, if its a string the whole string will be shown
 * @param {Number} offset
 */
function memoryDumpData(offset)

```



Examples:
- `wpcInterface.writeMemory(78, 0, true);` -> change memory at offset 78 with value 0 until the machine is rebooted, the emulator cannot overwrite the content at the defined offset!
- `wpcInterface.writeMemory(78, 0);` -> change memory at offset 78 with value 0, the emulator can overwrite the stored value
- `wpcInterface.writeMemory(0x1C65, 'XXX');` -> write string XXX to memory at offset 0x1C65
- `wpcInterface.memoryFindData('OMA', 'string');` -> search memory for the string OMA
- `wpcInterface.memoryFindData(3, 'uint8');` -> search memory for the uint8 value with 3 (useful for example if you want to find out where the number of players is stored)
- `wpcInterface.memoryDumpData(0x181F);` - dumps the value at the offset 0x181F

Note: WPC-EMU currently supports the data types `uint8`, `uint16`, `uint32`, `bcd` and `string`.

### Advanced example: "find RAM location of current credits"

- start Hurricane ROM, wait until mainscreeen is visible
- press key "2" to add two credits (total 2 credits)
- run `wpcInterface.memoryFindData(2, 'uint8', true)` to search all memory locations that contain 2 - no output is visible yet
- press key "2" to add two credits (total 4 credits)
- run `wpcInterface.memoryFindData(4, 'uint8', true)` now you see all memory locations that matched all checks (2)
- press key "2" to add two credits (total 6 credits)
- run `wpcInterface.memoryFindData(6, 'uint8', true)` now you see all memory locations that matched all checks (3), output:

```
0x6 uint8 FOUND at position 0x356
0x6 uint8 FOUND at position 0x990
0x6 uint8 FOUND at position 0x9AA
0x6 uint8 FOUND at position 0x1831
0x6 uint8 FOUND at position 0x1855
0x6 uint8 FOUND at position 0x1879
0x6 uint8 FOUND at position 0x1C93
```

## Midnight Madness Mode

Source: http://www.flippers.be/basics/101_midnight_madness.html

Midnight Madness is a special mode that's only available on a few Williams pinball machines. The name reveals what it is: a special mode that only starts when the game is played at midnight..

Only these games have it:
- Congo
- Dirty Harry
- Johnny Mnemonic
- Junk Yard
- NBA Fastbreak
- Who Dunnit

On some games (like Congo) it can be enabled/disabled in its settings, 'Special mode' has to be on.

Then when you are playing and the pinball machines internal clock reaches midnight, the game stops (it's like the power has been cut) and after a few seconds says 'midnight madness' on the display (on most games there's also a special sound indication).
For one minute you get a multiball.. some games display additional graphics on the display when targets are hit.

Midnight Madness was the idea of Dwight Sullivan, who had a dream of seeing every game in an arcade light up with this mode at the exact same time. That also meant asking other programmers to put the MM routine into their games. Some did and some didn't.

When you start a game on Junk Yard right before the clock reaches midnight, the devil will say 'interesting' at the start of the game, instead of the regular 'Crazy Bob' opening scene.

Note Theatre of Magic does not have this Midnight Madness special mode. Midnight Madness is the name of a regular mode in the game that can be started on every game played..

## Rip DMD Animation

To drive ColorDMD displays, DMD animations needs to be colorized. The source of those animations are existing monochrome animations.

Slippifishi of http://vpuniverse.com was kind enough to write a tutorial how he rip DMD animations :tada:.

### Intro

As for how I've been using this, well I will use "Demolition Man" and "The Flintstones" as examples...

First, I think this tool is most useful for concentrated and specific dumps - you need to know what you want to dump before you come here. Running through the whole game and capturing everything is certainly possible, but I have found especially useful in getting all related scenes in one hit.

For example, in "Demolition Man" there are 5 stand up targets on the playfield. As you hit these it gives a "standup millions award" each hit, you cycle through them 4 times, up to a total of 20. When trying to catch these through normal VPinball gameplay, they were often inconsistent in length (some would have 12 frames, some would have 13), and they would often get interrupted by some other animation - I spent **ages** hunting for the 14 million standup because every time I hit it, something else would get in the way and spoil the dump. In the end I managed to capture most of them, but they were split up over several dump files, and not in any logical order. I didn't mind trying to play for all the animations, but when you have a 200MB txt dump file and you just want 13 frames from somewhere roughly in the middle, it can be painfully slow and time wasting. Then came WPC-EMU and changed my approach!

I have been using it as follows...

### First load up the desired ROM in the drop down in the top left.

The page will reload, and all of the switches associated to the selected table will be shown on screen; there will be switches for the ball launch, credits, tilt, outlanes, slings, standups, etc, and also any special toys associated with the table. This is where knowing the table is important as you will have to manually activate these switches in order to get the game to the point you want to dump.

### Insert coin(s) and hit the start button to begin a game

Note that (all of?) the switches act like toggles, so one click turns the switch on, the next click turns it off. The recent change to the UI means the button will now also reflect the on/off state, but you can also see the "SWITCH IN MATRIX" which also shows a secondary visual representation of all the switches. Honestly, I approach this step as if I am playing a game of pinball - start by inserting coin(s), then I press start, then I launch the ball, then the ball hits this switch, then that switch etc - "be the ball". I also taught myself to always toggle switches twice - always leave the switches in their default state otherwise when you want to click it again later you may have to click it twice!

### Prepare to dump

Hit the necessary switches to get the game to the right state. Using "The Flintstones" as a different example, when I was trying to capture the different strike/spare animations for the bowling game, you must first hit the left or right ramp; so you toggle that switch and notice that the DMD displays the animation associated to that switch (an animation of fred running). From my gameplay testing, I know that if I hit the left, centre or right bowling target (any 1 of 3 separate switches) within a second or two of that left ramp switch then I will get the animation I want.

### Begin to dump

Before I invoke the animation, I need to begin the dump. Click the DMD dump button in the top right of the browser - the dump is now capturing.

### Fire the animation(s)

Anything that fires while the DMD dump is enabled will be stored in the dump. Hit the switch(es) and watch the animation. When I was doing "Demolition Man" I literally hit the 5 stand up targets one after the other, 4 times in a row. Just like that I had all 20 different animations, in a single dump, less than 1000 frames; and they were all in sequence, right after each other in the dump, it made finding them in the editor a breeze.

### Save the dump

Click the DMD Dump button again; you will be prompted to saw the raw file.
You can now load the raw file into PIN2DMD Editor (https://pin2dmd.com/) and use it like a normal dump.

Arguably you can achieve the same thing through VPX and dragging the ball around, or even by doing a dump using the real table and manually hitting the switches. But having it in browser does remove a lot of the set up necessary and make it much closer to hand :) The temptation I am finding is to do a majority of my scene cutting via way of very controlled dumps!

# References

## Terms
- Attraction Mode: the time when no game is running and the lamps are blinking to attract people
- Drain: The common term used to refer to the area beneath the flippers. If the ball rolls into the drain area via an outlane or between the flippers, it will be lost. Also refers to the act of losing a ball in this manner.
- Plunger: The object used to launch a ball onto the playfield
- HSTD: High Score to Date
- EOS (Switch): end-of-stroke
- HUO: Home use only
- NIB: new in box
- NOS: new old stock
- HER: high end restoration
- LE: limited edition

## ROM Revision / Software Version Information
Source: http://www.planetarypinball.com/mm5/Williams/tech/sys11roms.html

System 11 games have the software revision identified with either an "L" or "P" followed by a revision number, such as L-1 or P-1. The "L" signifies a production ("Level") release, while the "P" signifies a Prototype version of software. Sometimes contained within the revision label is a version identifier, such as LX-1 or LA-1. The possible version identifiers are the described below.

Not all versions exist for all games.

* No suffix: Unrestricted. This version supports all text languages, can be priced for any country, and contains the custom pricing editor.
* A: USA and Canada (domestic). This version does not contain the custom pricing editor, and does USA and Canada pricing modes only.
* X: Export. This version contains the custom pricing editor, as well as the built-in pricing presets for all countries.
* R: Regular. This version does all pricing modes, as well as the custom pricing editor, but does not contain French text.
* F: France. This version is the same as the R version, with the addition of French text.
* B: Belgium/Switzerland. This version contains French text, does not have the custom pricing editor, and does Belgium, Switzerland, and Canada pricing modes only.
* G: Germany. This version contains support for special German functionality, such as German speech.

More, unofficial suffix:
* F: usually "Family" or "Family-Friendly" - but in the case of Party Zone, the F is to specify "Fliptronic Flipper Board" rather than the standard code.
* H: Home
* LD: LED anti ghosting versions

## WPC

- http://bcd.github.io/freewpc/The-WPC-Hardware.html
- https://en.wikipedia.org/wiki/Williams_Pinball_Controller
- http://www.maddes.net/pinball/wpc_debugging.htm
- https://bitbucket.org/grumdrig/williams/src/master/
- http://www.edcheung.com/album/album07/Pinball/wpc_sound.htm
- http://techniek.flipperwinkel.nl/wpc/index2.htm#switch
- http://arcarc.xmission.com/Pinball/PDF%20Pinball%20Manuals%20and%20Schematics/
- https://github.com/tanseydavid/WPCResources
- https://github.com/tomlogic/pinmame-nvram-maps

## Pinball 2000
- https://github.com/boilerbots/PB2K

## DMD
- http://webpages.charter.net/coinopcauldron/dotarticle.html

## CPU
- http://atjs.mbnet.fi/mc6809/
- https://github.com/maly/6809js (use this CPU core, fixed typos + implemented IRQ handling)
- http://www.roust-it.dk/coco/6809irq.pdf

## Security Chip
- http://www.edcheung.com/album/album07/Pinball/wpc_sound2.htm

## Sound Chip
- http://www.ionpool.net/arcade/gottlieb/technical/datasheets/YM2151_datasheet.pdf
- https://sourceforge.net/p/pinmame/code/HEAD/tree/trunk/src/sound/
- https://github.com/kode54/Game_Music_Emu/blob/master/gme/
- http://www.cx5m.net/fmunit.htm
- https://github.com/apollolux/ym2413-js/blob/master/ym2413.js
- https://github.com/vgm/node-vgmplay/blob/master/res/js/vgm/ym2151.js
- https://en.wikipedia.org/wiki/Digital_Compression_System
- http://rbelmont.mameworld.info/?page_id=223 (M1 sounds for arcade machine)
- https://github.com/bartgrantham/fpemu (Emulation of the sound board from Williams Firepower pinball machine)
- http://www.planetarypinball.com/mm5/Williams/archives/willy3.htm (DCS)
- http://www.planetarypinball.com/mm5/Williams/archives/willy9.htm (preDCS)

## ROM
- http://www.ipdb.org/
- http://www.planetarypinball.com/mm5/Williams/tech/wpcroms.html

## Custom Power Driver
- https://www.multimorphic.com/store/circuit-boards/pd-16/

## Misc
- Bally - Electronic Pinball Games, Theory of operation, F.O. 601-2 (Note: this is for the pre DMD model)
- John R. Bork - REVERSE ENGINEERING A MICROCOMPUTER-­BASED CONTROL UNIT

# Game List

Ripped from Wikipedia, entries with a 🚀 are included in the online version

## WPC (Alphanumeric)
- Dr. Dude 🚀 (Prototype only) - August 1990
- FunHouse 🚀 - September 1990
- Harley-Davidson 🚀 - February 1991
- The Machine: Bride of Pin·Bot 🚀 - February 1991

Some Dr. Dude machines were also made using this WPC generation, although most were made using the later System 11 board.

## WPC (Dot Matrix)
- SlugFest! (redemption game) 🚀 - March 1991
- Gilligan's Island 🚀 - May 1991
- Terminator 2: Judgment Day 🚀 - July 1991
- Hurricane 🚀 - August 1991
- The Party Zone 🚀 - August 1991
- Hot Shot Basketball (redemption game) 🚀 - October 1994
- Strike Master Shuffle Alley (redemption game) 🚀 - 1991

Terminator 2: Judgment Day was the first to be designed with a dot matrix display, but was released after Gilligan's Island, due to Terminator 2 having a longer development time than Gilligan's Island.

## WPC (Fliptronics)
- The Getaway: High Speed II 🚀 - February 1992
- The Addams Family 🚀 - March 1992
- Black Rose 🚀 - July 1992
- Fish Tales 🚀 - October 1992
- Doctor Who 🚀 - October 1992
- Creature from the Black Lagoon 🚀 - December 1992
- White Water 🚀 - January 1993
- Bram Stoker's Dracula 🚀 - March 1993
- Twilight Zone 🚀 - March 1993
- The Addams Family Special Collectors Edition 🚀 - October 1994

The Addams Family was the only game produced with the Fliptronics I board, which is compatible with Fliptronics II boards, which added a bridge rectifier for the flipper voltage.

## WPC (DCS)
- Indiana Jones: The Pinball Adventure 🚀 - August 1993
- Judge Dredd 🚀 - September 1993
- Star Trek: The Next Generation 🚀 - November 1993
- Addams Family Values (redemption game) 🚀 - January 1994
- Popeye Saves the Earth 🚀 - February 1994
- Demolition Man 🚀 - February 1994

Twilight Zone was designed to be the first pinball machine to use the new DCS system, but due to delays of the new hardware design it was decided to release it on the old hardware (using downsampled sound effects) instead.

## WPC-S (Security)
Starting with World Cup Soccer, a security programmable integrated circuit (PIC) chip was added to the CPU board in all WPC-S games at location U22. This PIC chip was game specific making it so CPU boards could not be swapped between different models without changing the security PIC chip.

- World Cup Soccer 🚀 - February 1994
- The Pinball Circus (very rare, only 2 pins exists, ROM image and source are lost) - June 1994
- The Flintstones 🚀 - July 1994
- Corvette 🚀 - August 1994
- Red & Ted's Road Show 🚀 - October 1994
- The Shadow 🚀 - November 1994
- Dirty Harry 🚀 - March 1995
- Theatre of Magic 🚀 - March 1995
- No Fear: Dangerous Sports 🚀 - May 1995
- Indianapolis 500 🚀 - June 1995
- Johnny Mnemonic 🚀 - August 1995
- Jack·Bot 🚀 - October 1995
- WHO Dunnit 🚀 - September 1995

## WPC-95
In this final revision of the WPC hardware, the dot matrix controller and the DCS sound boards are combined into a single A/V board, while the Power/Driver and the Fliptronics boards are combined into a single Power/Driver board, bringing the board count down to three boards. It also includes the same game-specific security PIC introduced in the WPC-Security system.

- Congo 🚀 - November 1995
- Attack from Mars 🚀 - December 1995
- Ticket Tac Toe (redemption game) 🚀 - March 1996
- League Champ Shuffle Alley (redemption game) 🚀 - March 1996
- Safecracker 🚀 - March 1996
- Tales of the Arabian Nights 🚀 - May 1996
- Scared Stiff 🚀 - September 1996
- Junk Yard 🚀 - December 1996
- NBA Fastbreak 🚀 - March 1997
- Medieval Madness 🚀 - June 1997
- Cirqus Voltaire 🚀 - October 1997
- No Good Gofers 🚀 - December 1997
- The Champion Pub 🚀 - April 1998
- Monster Bash 🚀 - July 1998
- Cactus Canyon 🚀 - October 1998
