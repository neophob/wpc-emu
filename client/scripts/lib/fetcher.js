'use strict';

export { downloadFileFromUrlAsUInt8Array };

function downloadFileFromUrlAsUInt8Array(url) {
  if (!url) {
    return Promise.resolve();
  }
  return fetch(url)
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
