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