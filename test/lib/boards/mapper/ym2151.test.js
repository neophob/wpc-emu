'use strict';

import test from 'ava';
import Ym2151Mapper from '../../../../lib/boards/mapper/ym2151';

test('Ym2151Mapper, should get unused register 0', (t) => {
  t.is(Ym2151Mapper.getRegisterName(0), 'NOT_USED');
});

test('Ym2151Mapper, should get unused register 3', (t) => {
  t.is(Ym2151Mapper.getRegisterName(3), 'NOT_USED');
});

test('Ym2151Mapper, should get clock register 0x14', (t) => {
  t.is(Ym2151Mapper.getRegisterName(0x14), 'CLOCK FUNCTIONS');
});

test('Ym2151Mapper, should get inrange minimal register 0x38', (t) => {
  t.is(Ym2151Mapper.getRegisterName(0x38), 'PHASE & AMPLITUDE MODULATION SENSITIVITY');
});

test('Ym2151Mapper, should get inrange register 0x50', (t) => {
  t.is(Ym2151Mapper.getRegisterName(0x50), 'DETUNE & PHASE MULTIPLY');
});

test('Ym2151Mapper, should get inrange maximal register 0xFF', (t) => {
  t.is(Ym2151Mapper.getRegisterName(0xFF), 'EG DECAY LEVEL, RELEASE RATE');
});

test('Ym2151Mapper, should get value for undefined', (t) => {
  t.is(Ym2151Mapper.getRegisterName(), 'WTF?');
});

test('Ym2151Mapper, should get value for too big value', (t) => {
  t.is(Ym2151Mapper.getRegisterName(555), 'WTF?');
});
