import browserEnv from 'browser-env';
import test from 'ava';
import { getUploadedFile } from '../../../scripts/lib/rom-uploader.js';

const FAKE_FILE_CONTENT = 'ABC';

test.beforeEach((t) => {
  browserEnv();
  t.context.callback = [];

  const div = document.createElement('div');
  document.body.appendChild(div);

  const htmlInput = document.createElement('INPUT');
  htmlInput.setAttribute('type', 'file');
  htmlInput.setAttribute('id', 'romUpload');

  div.appendChild(htmlInput);

  htmlInput.addEventListener = function (name, func) {
    t.context.callback[name] = func;
  };
  t.context.htmlInput = htmlInput;
});

test.serial('getUploadedFile, should abort', (t) => {
  const promise = getUploadedFile()
    .catch((error) => {
      t.is(error.message, 'ABORT');
    });

  t.context.callback.abort();

  return promise;
});

test.serial('getUploadedFile, should throw error', (t) => {
  const promise = getUploadedFile()
    .catch((error) => {
      t.is(error.message, 'foo');
    });

  t.context.callback.error(new Error('foo'));

  return promise;
});

test.serial('getUploadedFile, should resolve but no files defined - abort', (t) => {
  const promise = getUploadedFile()
    .catch((error) => {
      t.is(error.message, 'ABORT_MISSING_FILES_PROPERTIES');
    });

  t.context.callback.change();

  return promise;
});

test.serial('getUploadedFile, should resolve', (t) => {
  const promise = getUploadedFile()
    .then((value) => {
      t.deepEqual(value, stringToArrayBuffer(FAKE_FILE_CONTENT));
    });

  const files = [ 'sample1.txt' ];
  addFileListToInputElement(t.context.htmlInput, files);
  t.context.callback.change();

  return promise;
});

function stringToArrayBuffer(string) {
  var buf = new ArrayBuffer(string.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = string.length; i < strLen; i++) {
    bufView[i] = string.charCodeAt(i);
  }
  return buf;
}

function addFileListToInputElement(elements, filePaths) {
  const fileList = filePaths.map(fp => createFile(fp));
  fileList.__proto__ = Object.create(FileList.prototype);

  Object.defineProperty(elements, 'files', {
    value: fileList,
    writable: false,
  });
}

function createFile(filePath) {
  return new File(
    [FAKE_FILE_CONTENT],
    filePath,
    {
      lastModified: Date.now(),
      type: 'foo',
    }
  );
}
