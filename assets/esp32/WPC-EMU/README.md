# Fish Tales

To get actual feedback of a real device in the EMU, those signals are needed:
- 8x8 Switch Matrix: provide information about the switches
- Reset: synchronize real hardware when reset occurs
- Zerocross: keep EMU and real machine in sync

Simple plan is to connect those wires to the GPIO pins of the ESP32 board

## ESP32 Devkit Pins

> The pins D0, D1, D2, D3, CMD and CLK are used internally for communication between ESP32 and SPI flash memory. They are
> grouped on both sides near the USB connector. Avoid using these pins, as it may disrupt access to the SPI flash memory / SPI >RAM.

>The pins GPIO16 and GPIO17 are available for use only on the boards with the modules ESP32-WROOM and ESP32-SOLO-1. The boards with ESP32-WROVER modules have the pins reserved for internal use.

This means those Pins cannot be used:
- 31 (CLK)
- 32 (D0)
- 33 (D1)
- 28 (D2)
- 29 (D3)
- CMD (30)

## VCC/GND Connection

Power Supply Options, There are three mutually exclusive ways to provide power to the board:
- Micro USB port, default power supply
- 5V / GND header pins
- 3V3 / GND header pins

> Warning:
> The power supply must be provided using one and only one of the options above, otherwise the board and/or the power supply source can be damaged.

### GND

Source: Power driver Board (A-12697-1)
Connections:
- TP5

### 5V Digital

Source: Power driver Board (A-12697-1)
Connections:
- TP2

## GPIO Connections

Source: CPU Board (A-12742-50005)
Connections:
- J206/J207 (Column)
- J208/J209 (Row)

## Reset sense

Source: CPU Board (A-12742-50005)
Connections:
- D25 (cathode side), left of CPU6809

## Zerocross

Source: Power driver Board (A-12697-1)
Connections:
- TP4

# Plan

## Step 1

- connect GND
- connect Reset
- connect Zerocross
- validate Zerocross signal can be read

### Conclusion

- When disconnect the ESP Pinball crash - this is because the reset line. -> configure pins as INPUT instead INPUT_PULLxxx
- Reset Pinball works
- Zerocross count works:

```
18:34:56.018 -> switchColumn: 2, switchInput: 0, zeroconfInterruptCounter 7701, duration: 2 us
18:34:56.055 -> switchColumn: 2, switchInput: 0, zeroconfInterruptCounter 7703, duration: 2 us
18:34:56.055 -> switchColumn: 2, switchInput: 0, zeroconfInterruptCounter 7704, duration: 2 us
18:34:56.091 -> switchColumn: 2, switchInput: 0, zeroconfInterruptCounter 7706, duration: 2 us
18:34:56.091 -> switchColumn: 2, switchInput: 0, zeroconfInterruptCounter 7707, duration: 2 us
18:34:56.091 -> switchColumn: 2, switchInput: 0, zeroconfInterruptCounter 7709, duration: 2 us
```

Next steps: if EMU connects real pinball
- synchronize Zerocross count (reset EMU, make sure RAM Check is executed) then fast forward