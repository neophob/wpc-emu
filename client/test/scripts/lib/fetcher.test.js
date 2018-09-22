'use strict';

import test from 'ava';
import { downloadFileFromUrlAsUInt8Array } from '../../../scripts/lib/fetcher';

test('fetcher, should ignore empty url', (t) => {
  return downloadFileFromUrlAsUInt8Array()
    .then((value) => {
      t.is(value, undefined);
    });
});
