/*
There are 34 distinct GPIOs available on the ESP32. They are identified as:
• GPIO_NUM_0 – GPIO_NUM_19
• GPIO_NUM_21 – GPIO_NUM_23
• GPIO_NUM_25 – GPIO_NUM_27
• GPIO_NUM_32 – GPIO_NUM_39
The ones that are omitted are 20, 24, 28, 29, 30 and 31.

Note that GPIO_NUM_34 – GPIO_NUM_39 are input mode only. You can not use these pins for signal output.

Also, pins 6 (SD_CLK), 7 (SD_DATA0), 8 (SD_DATA1), 9 (SD_DATA2), 10 (SD_DATA3), 11 (SD_CMD) 16 (CS) and 17(Q) are used to interact
with the SPI flash chip … you can not use those for other purposes.

When using pSRAM, Strapping pins are GPIO0, GPIO2 and GPIO12.
TX and RX (as used for flash) are GPIO1 and GPIO3.


pinMode:
- INPUT: Pins configured this way are said to be in a high-impedance state. Input pins make extremely small demands on the 
         circuit that they are sampling, equivalent to a series resistor of 100 megohm in front of the pin.
- INPUT_PULLUP: There are 20K pullup resistors built into the Atmega chip that can be accessed from software. These built-in 
                pullup resistors are accessed by setting the pinMode() as INPUT_PULLUP.

TODO: validate those values for the ESP32!

TODO:
 - measure zerocross signal
 - measure reset signal

 */

//#define DEBUG

//NOTE: LABEL ON ESP32 DEV BOARD IS "VN"
#define GPIO_RO_ZEROCROSS 39

// NOTE: GPIO 34-39 have no internal configurable pullup/down

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

// Regular we attach an interrupt to this pin, however we can reconfigure this pin as output at runtime to send out a reset impulse
#define GPIO_RW_RESET_SENSE 14

//TODO?
//RESET WRITE?

#define GPIO_RESERVED_1 4
#define GPIO_RESERVED_2 12
#define GPIO_RESERVED_3 2
#define GPIO_RESERVED_4 0
#define GPIO_RESERVED_I2C_1 21
#define GPIO_RESERVED_I2C_2 22

portMUX_TYPE muxReset = portMUX_INITIALIZER_UNLOCKED;
volatile uint32_t resetInterruptCounter = 0;

void IRAM_ATTR handleResetInterrupt() {
    portENTER_CRITICAL_ISR(&muxReset);
    resetInterruptCounter++;
    portEXIT_CRITICAL_ISR(&muxReset);
}

portMUX_TYPE muxZeroconf = portMUX_INITIALIZER_UNLOCKED;

portMUX_TYPE muxSwitchColumn = portMUX_INITIALIZER_UNLOCKED;
volatile uint32_t switchColumn = 0;

void IRAM_ATTR handleZerocrossInterrupt() {
    // ZeroCross should occur 120 times per second (NTSC running at 60Hz)
    portENTER_CRITICAL_ISR(&muxZeroconf);
    zeroconfInterruptCounter++;
    portEXIT_CRITICAL_ISR(&muxZeroconf);
}

void IRAM_ATTR column1Interrupt() {
    portENTER_CRITICAL_ISR(&muxSwitchColumn);
    switchColumn = 0;
    portEXIT_CRITICAL_ISR(&muxSwitchColumn);
}

void IRAM_ATTR column2Interrupt() {
    portENTER_CRITICAL_ISR(&muxSwitchColumn);
    switchColumn = 1;
    portEXIT_CRITICAL_ISR(&muxSwitchColumn);
}

void IRAM_ATTR column3Interrupt() {
    portENTER_CRITICAL_ISR(&muxSwitchColumn);
    switchColumn = 2;
    portEXIT_CRITICAL_ISR(&muxSwitchColumn);
}

void IRAM_ATTR column4Interrupt() {
    portENTER_CRITICAL_ISR(&muxSwitchColumn);
    switchColumn = 3;
    portEXIT_CRITICAL_ISR(&muxSwitchColumn);
}

void IRAM_ATTR column5Interrupt() {
    portENTER_CRITICAL_ISR(&muxSwitchColumn);
    switchColumn = 4;
    portEXIT_CRITICAL_ISR(&muxSwitchColumn);
}

void IRAM_ATTR column6Interrupt() {
    portENTER_CRITICAL_ISR(&muxSwitchColumn);
    switchColumn = 5;
    portEXIT_CRITICAL_ISR(&muxSwitchColumn);
}

void IRAM_ATTR column7Interrupt() {
    portENTER_CRITICAL_ISR(&muxSwitchColumn);
    switchColumn = 6;
    portEXIT_CRITICAL_ISR(&muxSwitchColumn);
}

void IRAM_ATTR column8Interrupt() {
    portENTER_CRITICAL_ISR(&muxSwitchColumn);
    switchColumn = 7;
    portEXIT_CRITICAL_ISR(&muxSwitchColumn);
}


void initGpio() {
    pinMode(GPIO_RO_ZEROCROSS, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RO_ZEROCROSS), handleZerocrossInterrupt, RISING);


    //TODO
    // - keep data in memory to build up a 8x8 matrix
    // - validate that active colum switches timing match the esp timing or if we need in interrupt

    pinMode(GPIO_RO_ACTIVE_COLUMN_1, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RO_ACTIVE_COLUMN_1), column1Interrupt, RISING);

    pinMode(GPIO_RO_ACTIVE_COLUMN_2, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RO_ACTIVE_COLUMN_2), column2Interrupt, RISING);

    pinMode(GPIO_RO_ACTIVE_COLUMN_3, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RO_ACTIVE_COLUMN_3), column3Interrupt, RISING);

    pinMode(GPIO_RO_ACTIVE_COLUMN_4, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RO_ACTIVE_COLUMN_4), column4Interrupt, RISING);

    pinMode(GPIO_RO_ACTIVE_COLUMN_5, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RO_ACTIVE_COLUMN_5), column5Interrupt, RISING);

    pinMode(GPIO_RO_ACTIVE_COLUMN_6, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RO_ACTIVE_COLUMN_6), column6Interrupt, RISING);

    pinMode(GPIO_RO_ACTIVE_COLUMN_7, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RO_ACTIVE_COLUMN_7), column7Interrupt, RISING);

    pinMode(GPIO_RO_ACTIVE_COLUMN_8, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RO_ACTIVE_COLUMN_8), column8Interrupt, RISING);

    pinMode(GPIO_RO_SWITCH_INPUT_1, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_2, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_3, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_4, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_5, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_6, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_7, INPUT);
    pinMode(GPIO_RO_SWITCH_INPUT_8, INPUT);

    initialiseResetInput();
    //- RW Coin Door input: 3 (coins & service menu)
    //- RW Fliptronics input: 8
}

void initialiseResetInput() {
    pinMode(GPIO_RW_RESET_SENSE, INPUT);
    attachInterrupt(digitalPinToInterrupt(GPIO_RW_RESET_SENSE), handleResetInterrupt, RISING);
}

void resetPinballMachine() {
    detachInterrupt(digitalPinToInterrupt(GPIO_RW_RESET_SENSE));
    pinMode(GPIO_RW_RESET_SENSE, OUTPUT);
    // TODO set pin high/low and delay some ms
    initialiseResetInput();
}

uint8_t switchState[8] = { 0,0,0,0,0,0,0,0 };

void loopGPIO() {
  if (resetInterruptCounter > 0) {
    Serial.printf("RESET INTERRUPT DETECTED: %lu\n", (unsigned long)resetInterruptCounter);
    zeroconfInterruptCounter = 0;
    resetInterruptCounter = 0;
  }

#ifdef DEBUG
  unsigned long now = micros();
#endif

  // reading 2 x 8 pins takes 4us on the devboard
/*  bitWrite(activeColumn, 0, digitalRead(GPIO_RO_ACTIVE_COLUMN_1));
  bitWrite(activeColumn, 1, digitalRead(GPIO_RO_ACTIVE_COLUMN_2));
  bitWrite(activeColumn, 2, digitalRead(GPIO_RO_ACTIVE_COLUMN_3));
  bitWrite(activeColumn, 3, digitalRead(GPIO_RO_ACTIVE_COLUMN_4));
  bitWrite(activeColumn, 4, digitalRead(GPIO_RO_ACTIVE_COLUMN_5));
  bitWrite(activeColumn, 5, digitalRead(GPIO_RO_ACTIVE_COLUMN_6));
  bitWrite(activeColumn, 6, digitalRead(GPIO_RO_ACTIVE_COLUMN_7));
  bitWrite(activeColumn, 7, digitalRead(GPIO_RO_ACTIVE_COLUMN_8));*/

  uint8_t switchInput = 0;
  bitWrite(switchInput, 0, digitalRead(GPIO_RO_SWITCH_INPUT_1));
  bitWrite(switchInput, 1, digitalRead(GPIO_RO_SWITCH_INPUT_2));
  bitWrite(switchInput, 2, digitalRead(GPIO_RO_SWITCH_INPUT_3));
  bitWrite(switchInput, 3, digitalRead(GPIO_RO_SWITCH_INPUT_4));
  bitWrite(switchInput, 4, digitalRead(GPIO_RO_SWITCH_INPUT_5));
  bitWrite(switchInput, 5, digitalRead(GPIO_RO_SWITCH_INPUT_6));
  bitWrite(switchInput, 6, digitalRead(GPIO_RO_SWITCH_INPUT_7));
  bitWrite(switchInput, 7, digitalRead(GPIO_RO_SWITCH_INPUT_8));
  switchState[ switchColumn ] = switchInput;

#ifdef DEBUG
  unsigned long now2 = micros();
  Serial.printf("switchColumn: %d, switchInput: %d, zeroconfInterruptCounter %lu, duration: %lu us\n", switchColumn, switchInput, zeroconfInterruptCounter, (unsigned long)now2-now);
#endif
}
