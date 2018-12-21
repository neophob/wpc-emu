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

GPIO 21 + 22 I2C

When using pSRAM, Strapping pins are GPIO0, GPIO2 and GPIO12. TX and RX (as used for flash) are GPIO1 and GPIO3.

see https://github.com/maniacbug/Arduino/blob/master/libraries/MCP23018/MCP23018.h

 */

#define GPIO_RO_ZEROCROSS 39

#define GPIO_RO_ACTIVE_COLUMN_1 38
#define GPIO_RO_ACTIVE_COLUMN_2 37
#define GPIO_RO_ACTIVE_COLUMN_3 36
#define GPIO_RO_ACTIVE_COLUMN_4 35
#define GPIO_RO_ACTIVE_COLUMN_5 34
#define GPIO_RO_ACTIVE_COLUMN_6 33
#define GPIO_RO_ACTIVE_COLUMN_7 32
#define GPIO_RO_ACTIVE_COLUMN_8 27

#define GPIO_RO_SWITCH_INPUT_1 26
#define GPIO_RO_SWITCH_INPUT_2 25
#define GPIO_RO_SWITCH_INPUT_3 23
#define GPIO_RO_SWITCH_INPUT_4 13
#define GPIO_RO_SWITCH_INPUT_5 5
#define GPIO_RO_SWITCH_INPUT_6 19
#define GPIO_RO_SWITCH_INPUT_7 18
#define GPIO_RO_SWITCH_INPUT_8 15

#define GPIO_RO_RESET_SENSE 14

//TODO?
//RESET WRITE?

#define GPIO_RESERVED_1 4
#define GPIO_RESERVED_2 12
#define GPIO_RESERVED_3 2
#define GPIO_RESERVED_4 0
#define GPIO_RESERVED_I2C_1 21
#define GPIO_RESERVED_I2C_2 22

void initGpio() {
    pinMode(GPIO_RO_ZEROCROSS, INPUT);
    
    pinMode(GPIO_RO_ACTIVE_COLUMN_1, INPUT);
    pinMode(GPIO_RO_ACTIVE_COLUMN_2, INPUT);
    pinMode(GPIO_RO_ACTIVE_COLUMN_3, INPUT);
    pinMode(GPIO_RO_ACTIVE_COLUMN_4, INPUT);
    pinMode(GPIO_RO_ACTIVE_COLUMN_5, INPUT);
    pinMode(GPIO_RO_ACTIVE_COLUMN_6, INPUT);
    pinMode(GPIO_RO_ACTIVE_COLUMN_7, INPUT);
    pinMode(GPIO_RO_ACTIVE_COLUMN_8, INPUT);
    
    pinMode(GPIO_RO_SWITCH_INPUT_1, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_2, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_3, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_4, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_5, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_6, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_7, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_8, INPUT);

    pinMode(GPIO_RO_RESET_SENSE, INPUT);

    //- RW Coin Door input: 3 (coins & service menu)
    //- RW Fliptronics input: 8
}
