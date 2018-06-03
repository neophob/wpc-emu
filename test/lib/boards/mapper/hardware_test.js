'use strict';

import test from 'ava';
import HardwareMapper from '../../../../lib/boards/mapper/hardware';

test('HardwareMapper, should get address, 16322', (t) => {
  const expectedResult = {
    offset: 16322,
    subsystem: 'sound',
  };
  const result = HardwareMapper.getAddress(16322);
  t.deepEqual(result, expectedResult);

});
