const fs = require('fs');
const path = require('path');
const audiosprite = require('audiosprite');

const TEMPDIR = 'tmp';

const FILE_EXTENSION = process.argv[3] ? process.argv[2] : '.wav';
console.log('use file extension', FILE_EXTENSION);

/*
Example:
 > node index.js DIRECTORY_WITH_AUDIO_SOURCE [optional file extension, default .wav]
*/

function copyFileToTemp(file) {
  const slash = file.split('/');
  const filename = slash[slash.length - 2];
  const id = parseInt(filename.split('-')[0], 10);
  const convertedFile = path.join(TEMPDIR, 'snd' + id + FILE_EXTENSION);
  console.log('>', file, '->', convertedFile);

  fs.copyFileSync(file, convertedFile);
  return convertedFile;
}

let samples = [];

function searchDirectory(startPath, filter, callbackFunction) {
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
      searchDirectory(filename, filter, callbackFunction);
    } else if (filename.indexOf(filter) >= 0) {
      const file = callbackFunction(filename);
      samples.push(file);
    }
  });
}

if (!process.argv[2]) {
  throw new Error('MISSING MUSIC_SOURCE_DIRECTORY_PATH');
}

// TODO sort output, support dups
const knownIds = [];
let dups = 0;
searchDirectory(process.argv[2], FILE_EXTENSION, ((file) => {
  const slash = file.split('/');
  const filename = slash[slash.length - 2];
  const type = slash[slash.length - 3];
  const id = parseInt(filename.split('-')[0], 10);

  if (knownIds[id]) {
    dups++;
    return;
  }

  knownIds[id] = true;
  if (type === 'music') {
    console.log(id + ': { channel: 0, loop: true },');
  } else if (type === 'jingle') {
    console.log(id + ': { channel: 1 },');
  }
}));

console.log('detected dups:', dups);
// yes hacky!
samples = [];

searchDirectory(process.argv[2], FILE_EXTENSION, copyFileToTemp);
console.log('> PROCESSED FILES', samples.length);

const opts = {
  output: 'output',
  export: 'mp3',
  format: 'howler',
  vbr: 9,
  samplerate: 22050,
  logger: {
    debug: (a, b) => console.log(a, b),
    info: (a, b) => console.log(a, b),
    log: (a, b) => console.log(a, b),
  },
};

console.log('> RUN AUDIOSPRITE',samples);
audiosprite(samples, opts, (err, obj) => {
  if (err) {
    return console.error(err);
  }
  console.log('OUTPUT STARTS, copy that part to the client/scripts/db/ game entry (audio key):');
  console.log(JSON.stringify(obj, null, 2));
});
