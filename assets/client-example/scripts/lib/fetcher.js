import 'whatwg-fetch';

export { downloadFileFromUrlAsUInt8Array };

function downloadFileFromUrlAsUInt8Array(filename) {
  if (!filename) {
    return Promise.reject(new Error('NO_FILENAME_DEFINED'));
  }

  return fetch(FETCHURL + filename)
    .then((response) => {
      if (response.status >= 400) {
        return Promise.reject(new Error('INVALID_STATUSCODE_' + response.status));
      }
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      return new Uint8Array(arrayBuffer);
    });
}
