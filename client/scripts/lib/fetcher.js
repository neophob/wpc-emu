'use strict';

import 'whatwg-fetch';
export { downloadFileFromUrlAsUInt8Array };

function downloadFileFromUrlAsUInt8Array(filename) {
  if (!filename) {
    return Promise.reject(new Error('NO_FILENAME_DEFINED'));
  }
  return fetch(FETCHURL + filename)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('INVALID_STATUSCODE_' + response.status);
      }
      return response.arrayBuffer();
    })
    .then((buffer) => {
      return new Uint8Array(buffer);
    });
}
