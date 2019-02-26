'use strict';

import test from 'ava';
import * as CONSTANT from '../../scripts/constants';

test('CONSTANT, should correctly convert zerocross ticks to steps', (t) => {
  const result = 2 * CONSTANT.FREQUENCY_HZ * CONSTANT.ZEROCROSS_TO_TICKS_MULTIPLIER;
  t.is(result, CONSTANT.TICKS_PER_SECOND);
});

test('CONSTANT, should correctly get ticks per call', (t) => {
  t.is(CONSTANT.TICKS_PER_CALL, 34482);
});
