'use strict';

import test from 'ava';
import Emulator from '../../lib/emulator';

const Package = require('../../package.json');

test('Emulator get version', (t) => {
  return Emulator.initVMwithRom({
    u06: new Uint8Array(262144),
  }).then((emulator) => {
    const version = emulator.version();
    t.is(version, Package.version);
  });
});
