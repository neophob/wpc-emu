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
    debug: true,
    autoProceed: true,
    restrictions: {
      maxFileSize: 1048576,
      maxNumberOfFiles: 1,
      minNumberOfFiles: 1,
    },
  });
  uppy.use(FileInput, {
    pretty: false,
    target: '.UppyInput',
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

  //TODO register cancel
  uppy.on('error', () => {
    callback(uppy.getState().error);
  });

  uppy.on('upload-error', () => {
    callback(uppy.getState().error);
  });

  uppy.on('cancel-all', () => {
    console.log('cancel-all')
  });

  uppy.on('info-hidden', () => {
    console.log('info-hidden')
  });
  uppy.on('info-visible', () => {
    console.log('info-visible')
  });
  uppy.on('file-removed', () => {
    console.log('file-removed')
  });
}

function fileToUint8Array(file) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result
      resolve(arrayBuffer);
    }
    fileReader.readAsArrayBuffer(file.data);
  });
}