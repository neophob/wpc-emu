# Fish Tales

To get actual feedback of a real device in the EMU, those signals are needed:
- 8x8 Switch Matrix: provide information about the switches
- Reset: synchronize real hardware when reset occurs
- Zerocross: keep EMU and real machine in sync

Simple plan is to connect those wires to the GPIO pins of the ESP32 board

## VCC/GND Connection

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
- J206 (Column)
- J209 (Row)

## Reset sense

Source: CPU Board (A-12742-50005)
Connections:
- D25, left of CPU6809
- C1
- J202, Pin 31
- R57 (SOUND BOARD)
- R49 (SOUND BOARD)

## Zerocross

Source: CPU Board (A-12742-50005)
Connections:
- ASIC Pin 71

OR

Source: Power driver Board (A-12697-1)
Connections:
- TP4

# Plan

## Step 1:

- connect GND
- connect Zerocross
- validate zerocross signal can be read