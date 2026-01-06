export { getUploadedFile };

function getUploadedFile() {
  return new Promise((resolve, reject) => {
    const romUploadElement = document.querySelector('#romUpload');

    function unregisterListeners() {
      romUploadElement.removeEventListener('abort', onAbort);
      romUploadElement.removeEventListener('error', onError);
      romUploadElement.removeEventListener('change', onChange);
    }

    function onAbort() {
      unregisterListeners();
      reject(new Error('ABORT'));
    }

    function onError(error) {
      unregisterListeners();
      reject(error);
    }

    function onChange() {
      unregisterListeners();
      const files = romUploadElement.files;
      if (!files || files.length !== 1) {
        return reject(new Error('ABORT_MISSING_FILES_PROPERTIES'));
      }

      fileToUint8Array(files[0])
        .then((arrayBuffer) => {
          resolve(arrayBuffer);
        });
    }

    romUploadElement.addEventListener('abort', onAbort);
    romUploadElement.addEventListener('error', onError);
    romUploadElement.addEventListener('change', onChange);
    romUploadElement.click();
  });
}

function fileToUint8Array(file) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      resolve(fileReader.result);
    });

    fileReader.readAsArrayBuffer(file);
  });
}
