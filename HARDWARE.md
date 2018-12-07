# Goal
Hardware interface to an existing Pinball machine - so we mirror whats happening on the real machine in the Emulator.

# Interface
A Teensy 3.5 - mainly because of the number of IO pins.
- Teensy 3.5 is 5V tolerant, while the Teensy 3.6 is 3.3V only
- 58 digital IO pins
- 27 analog IO pins

## Connections
- RO Active Column counter? used to switch to the next input switch slot
- RO Input switches: Switch input matrix 16 inputs (8x8 Matrix)
- RW Coin Door input: 8
- RW Fliptronics input: 8
- RW Reset Sense? did Pinball Machine just reset?
- RO VCC Sense: is the Pinball Machine running?
- RO Zerocross counter
- RO GND
- RO Fliptronics GND (?)

Total needed: 37

## Unknown
- can we fetch the uptime of the pinball machine to sync the cycle count? (aka stays in sync)
- should the emu able to write to the pinball machine (switch input? reset?)
- how should the physical interface looks like? opto interface?
- connect the switches to the pinbal electronics should be easy

## Firmware
Firmware sends data to the emulator (serial):
- zerocross counter (32bit)
- input switch matrix state (16bit)
- coin door state (8bit)
- fliptronic state (8bit)

### Firmware functions

### Reset sense
As soon as a reset signal is detected, reset Zerocross counter
TODO: how is a reset signal defined? Hi? Lo? Duration?

### Reset trigger
As soon as we want to use the hardware, the simulator and the pinball machine need to sync.
The simplest solution is to reset the pinball machine

### Uptime counter
A Zerocross is triggered 60 times per second. -> 3600 per minute, 216'000 per hour
-> we can track 9942 hours of uptime aka more than 414 days.

### Coin Door input
Track state of the coin door in one byte

### Fliptronics input
Track state of the fliptronics state in one byte

## Input switches
Keep the state of the 8 by 8 matrix in memory, know

## State sender
Interval task that sends its state 20 - 60 times per second to the simulator.
A second version might send the data only if there were state changes

## Trigger
Send a reset signal to the pinball machine
