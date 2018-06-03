'use strict';

import test from 'ava';
import SoundMapper from '../../../../lib/boards/mapper/sound';

test('SoundMapper, should fail when using invalid offset', (t) => {
  t.throws(SoundMapper.getAddress, 'SND_GET_ADDRESS_UNDEFINED');
});
