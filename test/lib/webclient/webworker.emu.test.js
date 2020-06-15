const test = require('ava');
const WebworkerEmu = require('../../../lib/webclient/webworker.emu');

test('WebworkerEmu: should successfully buildWpcInstance', (t) => {
  const gameEntry = {
    rom: {
      u06: 'filename',
    },
  };
  const romData = {
    u06: new Uint8Array(128 * 1024),
  };
  return WebworkerEmu.buildWpcInstance(romData, gameEntry)
    .then((emu) => {
      t.is(emu.getEmulatorRomName(), gameEntry.rom.u06);
    });
});

test('WebworkerEmu: buildWpcInstance should reject invalid ROM', (t) => {
  const gameEntry = {
    rom: {
      u06: 'filename',
    },
  };
  const romData = {
    u06: new Uint8Array(1),
  };
  return WebworkerEmu.buildWpcInstance(romData, gameEntry)
    .catch((error) => {
      t.is(error.message, 'INVALID_ROM_SIZE');
    });
});

test('WebworkerEmu: buildWpcInstance should reject invalid parameter', (t) => {
  return WebworkerEmu.buildWpcInstance({}, {})
    .catch((error) => {
      t.is(error.message, 'INVALID_PARAMETER');
    });
});
