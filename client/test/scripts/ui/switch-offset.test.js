'use strict';

import test from 'ava';
import { logicalIdToArrayOffset } from '../../../scripts/ui/switch-offset';

test('switch offset, logicalIdToArrayOffset: 11', (t) => {
  const result = logicalIdToArrayOffset(11);
  t.is(result, 0);
});

test('switch offset, logicalIdToArrayOffset: 0', (t) => {
  const result = logicalIdToArrayOffset(0);
  t.is(result, undefined);
});

test('switch offset, logicalIdToArrayOffset: 100', (t) => {
  const result = logicalIdToArrayOffset(100);
  t.is(result, undefined);
});
