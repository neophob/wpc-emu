'use strict';

import test from 'ava';
import romParser from '../../../lib/rom/index';

test('romParser should reject invalid data', (t) => {
  return romParser
    .parse()
    .catch((error) => {
      t.is(error.message, 'INVALID_ROM_DATA');
    });
});

test('romParser should parse roms', (t) => {
  const u06 = new Uint8Array(256 * 1024).fill(11);
  const u14 = new Uint8Array(0x4000).fill(22);
  const u15 = new Uint8Array(0x4000).fill(33);
  const u18 = new Uint8Array(0x4000).fill(44);
  const romData = {
    u06,
    u14,
    u15,
    u18,
  };
  return romParser
    .parse(romData)
    .then((result) => {
      t.is(result.concatenatedSoundRom[0x000000], 44);
      t.is(result.concatenatedSoundRom[0x080000], 33);
      t.is(result.concatenatedSoundRom[0x100000], 22);
      t.is(result.gameRom[0x000000], 11);
      t.is(result.fileName, 'Unknown');
      t.is(result.romSizeMBit, 2);
      t.is(result.skipWmcRomCheck, false);
      t.is(result.hasSecurityPic, false);
    });
});
