'use strict';

export { downloadFileFromUrlAsUInt8Array };

function downloadFileFromUrlAsUInt8Array(filename) {
  if (!filename) {
    return Promise.resolve();
  }
  console.log('FETCHURL' + FETCHURL );
  return fetch('http://127.0.0.1:8080/' + filename)
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
