'use strict';

import 'whatwg-fetch';
import { registerUppy } from './romUploader';

export { downloadFileFromUrlAsUInt8Array };

function downloadFileFromUrlAsUInt8Array(filename) {
  if (!filename) {
    return Promise.reject(new Error('NO_FILENAME_DEFINED'));
  }

  const getRomContent = filename === 'UPLOAD' ?
    userUploadRom() :
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

function userUploadRom() {
  return new Promise((resolve, reject) => {
    registerUppy((error, uploadedRom) => {
      if (error) {
        return reject(error);
      };
      resolve(uploadedRom);
    });

    //TODO cleanup
    const uppyHtmlElement = document.getElementsByClassName('uppy-FileInput-input');
    console.log('uppyHtmlElement',uppyHtmlElement);
    uppyHtmlElement[0].click();
  });
}
