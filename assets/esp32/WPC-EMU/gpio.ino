/*
There are 34 distinct GPIOs available on the ESP32. They are identified as:
• GPIO_NUM_0 – GPIO_NUM_19
• GPIO_NUM_21 – GPIO_NUM_23
• GPIO_NUM_25 – GPIO_NUM_27
• GPIO_NUM_32 – GPIO_NUM_39
The ones that are omitted are 20, 24, 28, 29, 30 and 31.

Note that GPIO_NUM_34 – GPIO_NUM_39 are input mode only. You can not use these pins
for signal output. 

Also, pins 6 (SD_CLK), 7 (SD_DATA0), 8 (SD_DATA1), 9 (SD_DATA2), 10 (SD_DATA3), 11 (SD_CMD) 16 (CS) and 17(Q) are used to interact
with the SPI flash chip … you can not use those for other purposes.

When using pSRAM, Strapping pins are GPIO0, GPIO2 and GPIO12. TX and RX (as used for flash) are GPIO1 and GPIO3.
 */
