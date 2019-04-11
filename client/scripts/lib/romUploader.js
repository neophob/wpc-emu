'use strict';

const Uppy = require('@uppy/core');
const FileInput = require('@uppy/file-input');

export { registerUppy };

function registerUppy(callback) {
  console.log('registerUppy');
  if (typeof callback !== 'function') {
    throw new Error('MISSING_CALLBACK_FUNCTION');
  }

  const uppy = new Uppy({
    id: 'wpc-uppy',
    debug: false,
    autoProceed: true,
    restrictions: {
      maxFileSize: 1048576,
      maxNumberOfFiles: 1,
      minNumberOfFiles: 1,
    },
  });
  uppy.use(FileInput, {
    pretty: true,
    target: '.UppyInput',
    locale: {
      strings: {
        chooseFiles: 'Upload ROM',
      },
    },
  });

  uppy.on('complete', (result) => {
    console.log('File uploaded');
    const file = result.successful[0];
    fileToUint8Array(file)
      .then((uInt8Array) => {
        callback(null, uInt8Array);
      })
      .catch((error) => {
        callback(error);
      });
  });

  uppy.on('error', () => {
    callback(uppy.getState().error);
  });
}

function fileToUint8Array(file) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result
      const bytes = new Uint8Array(arrayBuffer);
      resolve(bytes);
    }
    fileReader.readAsArrayBuffer(file.data);
  });
}