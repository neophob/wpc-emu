'use strict';

module.exports = {
  getRegisterName,
};

/*
source: http://www.cx5m.net/fmunit.htm
REGISTER #28-2F (KEY CODE)
REGISTER #30-37 (KEY FRACTION)
REGISTER #38-3F (PHASE & AMPLITUDE MODULATION SENSITIVITY)
REGISTER #40-5F (DETUNE & PHASE MULTIPLY)
REGISTER #60-7F (TOTAL LEVEL)
REGISTER #80-9F (EG ATTACK)
REGISTER #A0-BF (EG DECAY 1)
REGISTER #C0-DF (EG DECAY 2)
REGISTER #E0-FF (EG DECAY LEVEL, RELEASE RATE)
*/

const NOT_USED_REGISTER = [
  0x00, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E,
  0x10, 0x1A, 0x1C, 0x1D, 0x1E, 0x1F, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27,
];
const YM2151_REGISTER = [];
YM2151_REGISTER[0x01] = 'TEST & LFO RESET';
YM2151_REGISTER[0x08] = 'KEY ON';
YM2151_REGISTER[0x0F] = 'NOISE ENABLE, NOISE FREQUENCY';
YM2151_REGISTER[0x11] = 'CLOCK A1';
YM2151_REGISTER[0x12] = 'CLOCK A2';
YM2151_REGISTER[0x13] = 'CLOCK B';
YM2151_REGISTER[0x14] = 'CLOCK FUNCTIONS';
YM2151_REGISTER[0x18] = 'LOW FREQUENCY';
YM2151_REGISTER[0x19] = 'PHASE AND AMPLITUDE MODULATION';
YM2151_REGISTER[0x1B] = 'CONTROL OUTPUT & WAVE FORM SELECT';
YM2151_REGISTER[0x20] = 'CHANNEL CONTROL';

function isInRange(register, minValue, maxValue) {
  return register >= minValue && register <= maxValue;
}

function getRegisterName(register) {
  if (NOT_USED_REGISTER.includes(register)) {
    return 'NOT_USED';
  }
  const isSpecificRegister = YM2151_REGISTER[register];
  if (isSpecificRegister) {
    return isSpecificRegister;
  }
  if (isInRange(register, 0x28, 0x2F)) {
    return 'KEY CODE';
  }
  if (isInRange(register, 0x30, 0x37)) {
    return 'KEY FRACTION';
  }
  if (isInRange(register, 0x38, 0x3F)) {
    return 'PHASE & AMPLITUDE MODULATION SENSITIVITY';
  }
  if (isInRange(register, 0x40, 0x5F)) {
    return 'DETUNE & PHASE MULTIPLY';
  }
  if (isInRange(register, 0x60, 0x7F)) {
    return 'TOTAL LEVEL';
  }
  if (isInRange(register, 0x80, 0x9F)) {
    return 'EG ATTACK';
  }
  if (isInRange(register, 0xA0, 0xBF)) {
    return 'EG DECAY 1';
  }
  if (isInRange(register, 0xC0, 0xDF)) {
    return 'EG DECAY 2';
  }
  if (isInRange(register, 0xE0, 0xFF)) {
    return 'EG DECAY LEVEL, RELEASE RATE';
  }
  return 'WTF?';
}
