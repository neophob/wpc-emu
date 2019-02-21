# Goal
Hardware interface to an existing Pinball machine - so we mirror whats happening on the real machine in the Emulator.

# Interface

## Hardware options

## Needed Connections to pinball HW

Needed:

GPIO Extender connected (slow):
- RW Coin Door input: 3 (coins & service menu)
- RW Fliptronics input: 8

Direct connected (fast):
- RW Reset Sense? did Pinball Machine just reset: 1
- RO Zerocross counter: 1
- RO Active Column select - used to switch to the next input switch column: 8
- RO Switch input matrix 8 inputs (8x8 Matrix): 8

Unknown / nice to have:
- RO VCC Sense: is the Pinball Machine running: 1 (if no zerocross counts happens, machine is off)
- Add more "Coin Door" money input: 3 (else it is controlled by software only)
- Add "Coin Door" volume input: 2 (else service menu settings are not reflected)

Total needed: 29

## Questions
- can the hardware write to the pinball machine (switch input? reset?)
- how should the physical interface looks like? Opto-isolator?
- connect the switches to the pinball electronics should be easy, using Y connector?
- active column select is only available for pre security pic devices, intercept it when reading row select? how can we read out the settings?

## Hardware
Important criteria:
- 30 GPIO Pins
- Arduino IDE support (easy to use)
- BLE support

## GPIO Extender
- MCP23017 - I2C, 1700 kBits/s, 16-bit input/output port expander with interrupt output
- MCP23018 - I2C, 3400 kBits/s, 16-bit remote bidirectional I/O port
- MCP23009 - I2C, 3400 kBits/s, 8-bit remote bidirectional I/O port
- PCA9698 - 40-bit Fm+ I2C-bus advanced I/O port

### Hardware Option: Teensy
Points: 2 - need add BLE module

A Teensy 3.5 - mainly because of the number of IO pins.
- https://www.pjrc.com/store/teensy35.html
- Teensy 3.5 is 5V tolerant, while the Teensy 3.6 is 3.3V only
- 58 digital IO pins
- 27 analog IO pins
- No on board BLT/Wifi
- 30$

### Hardware Option: ESP32 DevKitC-V4
Points: 3
- https://www.espressif.com/en/products/hardware/esp32-devkitc/overview
- Implements Pulse Counter (used for zerocross)
- 32 GPIO Pins
- 15$

### Sparkfun "the Thing"
Points: 2 - not enough GPIO pins
- SparkFun ESP32 Thing - https://www.sparkfun.com/products/13907
- 22$
- 28 GPIO Pins

## Firmware
Firmware sends data to the emulator (serial):
- zerocross counter (32bit)
- input switch matrix state (64bit)
- coin door state (8bit)
- fliptronic state (8bit)
- power state (1bit)

Total: 15 bytes

### Firmware functions

### Reset sense
As soon as a reset signal is detected, reset Zeroconf counter
TODO: how is a reset signal defined? Hi? Lo? Duration?

### Reset trigger
It is possible to reset the pinball machine using the reset trigger.
TODO: add a resistor to protect the ESP32.

### Uptime counter (32b)
US: A Zerocross is triggered 120 times per second. -> 7200 per minute, 432'000 per hour
-> (4294967295/432000) = we can track 9942 hours of uptime aka more than 414 days.

EU: A Zerocross is triggered 100 times per second. -> 6000 per minute, 360'000 per hour
-> (4294967295/360000) = we can track 11930 hours of uptime aka more than 497 days.

### Coin Door input
Track state of the coin door in one byte

### Fliptronics input
Track state of the fliptronics state in one byte

## Input switches
Keep the state of the 8 by 8 matrix in memory. Use the Active Row counter to select next row

## State sender
Interval task that sends its state 15/30/60 times per second to the simulator.
A second version might send the data only if there were state changes

## Trigger
Send a reset signal to the pinball machine

# Date transfer from serial to Webbrowser

As the emu lives in the browser, options:
- Web Bluetooth API
- Serial Server that use Websocket to send data to the browser

## Web Bluetooth API
- Payload (currently 15 bytes) fits with the < 20 bytes GATT payload limit
- needs HTTPS connection

Questions:
- can a BT device stream data to browser (BLE) - startNotifications?
- Is there a UART to BT device available?

## Links:
- https://medium.com/@urish/start-building-with-web-bluetooth-and-progressive-web-apps-6534835959a6
- http://sabertooth-io.github.io/
- https://medium.com/@1oginov/how-to-make-a-web-app-for-your-own-bluetooth-low-energy-device-arduino-2af8d16fdbe8
