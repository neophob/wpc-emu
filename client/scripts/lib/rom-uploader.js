'use strict';

export { getUploadedFile };

function getUploadedFile() {
  return new Promise((resolve, reject) => {
    const romUploadElement = document.getElementById('romUpload');

    romUploadElement.addEventListener('abort', () => {
      const error = new Error('ABORT');
      reject(error);
    });

    romUploadElement.addEventListener('error', (error) => {
      reject(error);
    });

    romUploadElement.addEventListener('change', () => {
      const files = romUploadElement.files;
      if (!files || files.length !== 1) {
        const error = new Error('ABORT_MISSING_FILES_PROPERTIES');
        return reject(error);
      }

      fileToUint8Array(files[0])
        .then((arrayBuffer) => {
          resolve(arrayBuffer);
        });
    });
    //TODO unregister event listeners
    romUploadElement.click();
  });
}

function fileToUint8Array(file) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    }
    fileReader.readAsArrayBuffer(file);
  });
}
