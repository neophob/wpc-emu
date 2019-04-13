'use strict';

import 'whatwg-fetch';
import { getUploadedFile } from './rom-uploader';

export { downloadFileFromUrlAsUInt8Array };

function downloadFileFromUrlAsUInt8Array(filename) {
  if (!filename) {
    return Promise.reject(new Error('NO_FILENAME_DEFINED'));
  }

  const getRomContent = filename === 'UPLOAD' ?
    getUploadedFile() :
    fetch(FETCHURL + filename)
      .then((response) => {
        if (response.status >= 400) {
          return Promise.reject(new Error('INVALID_STATUSCODE_' + response.status));
        }
        return response.arrayBuffer();
      });

  return getRomContent
    .then((buffer) => {
      return new Uint8Array(buffer);
    });
}
