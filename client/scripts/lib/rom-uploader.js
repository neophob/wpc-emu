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
        const error = new Error('ABORT');
        return reject(error);
      }

      console.log('Filename:', files[0].name);
      console.log('Size:', files[0].size + " bytes");
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
  console.log('file',file)
  console.log('type', typeof file)
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result
      resolve(arrayBuffer);
    }
    fileReader.readAsArrayBuffer(file);
  });
}
