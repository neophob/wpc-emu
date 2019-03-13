const fs = require('fs');
const path = require('path');
const audiosprite = require('audiosprite');

const TEMPDIR = 'tmp';

function copyFileToTemp(file) {
  const slash = file.split('/');
  const filename = slash[slash.length - 2];
  const id = parseInt(filename.split('-')[0], 10);

  const convertedFile = path.join(TEMPDIR, 'snd' + id + '.wav');
  console.log('>', file, '->', convertedFile);

  fs.copyFileSync(file, convertedFile);
  return convertedFile;
}

const samples = [];

function searchDirectory(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.error('Invalid directory', startPath);
    process.exit(1);
  }

  const files = fs.readdirSync(startPath);
  files.forEach((file) => {
    const filename = path.join(startPath, file);
    const stat = fs.lstatSync(filename);
    //TODO symlink handling
    if (stat.isDirectory()) {
      searchDirectory(filename, filter);
    } else if (filename.indexOf(filter) >= 0) {
      const file = copyFileToTemp(filename);
      samples.push(file);
    }
  });
}

if (!process.argv[2]) {
  throw new Error('MISSING MUSIC_SOURCE_DIRECTORY_PATH');
}

searchDirectory(process.argv[2], '.wav');
console.log('PROCESSED FILES', samples.length);

const opts = {
  output: 'output',
  export: 'mp3',
  format: 'howler',
  vbr: 5,
  logger: {
    debug: (a, b) => console.log(a, b),
    info: (a, b) => console.log(a, b),
    log: (a, b) => console.log(a, b),
  },
};

audiosprite(samples, opts, (err, obj) => {
  if (err) {
    return console.error(err);
  }
  console.log('OUTPUT STARTS, copy that part to the client/scripts/db/ game entry (audio key):');
  console.log(JSON.stringify(obj, null, 2));
});
