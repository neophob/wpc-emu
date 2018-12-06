# Goal
Hardware interface to an existing Pinball machine - so we mirror whats happening on the real machine in the Emulator.

# Interface
A Teensy 3.5 - mainly because of the number of IO pins.
- Teensy 3.5 is 5V tolerant, while the Teensy 3.6 is 3.3V only
- 58 digital IO pins
- 27 analog IO pins

## Connections
- Input switches: Switch input matrix 16 inputs (8x8 Matrix)
- Coin Door input: 8
- Fliptronics input: 8
- VCC Sense: is the Pinball Machine running?
- Reset Sense? did Pinball Machine just reset?
- GND
- Fliptronics GND (?)

Total needed: 36

## Unknown
- can we fetch the uptime of the pinball machine to sync the cycle count? (aka stays in sync)
- should the emu able to write to the pinball machine (switch input? reset?)
- how should the physical interface looks like? opto interface?
- connect the switches to the pinbal electronics should be easy
