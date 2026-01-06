import test from 'ava';
import { downloadFileFromUrlAsUInt8Array } from '../../../scripts/lib/fetcher.js';

test('fetcher, should not ignore empty url', t => {
  downloadFileFromUrlAsUInt8Array()
    .catch(error => {
      t.is(error.message, 'NO_FILENAME_DEFINED');
    });
});
