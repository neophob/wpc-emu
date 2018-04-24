# IDEA

Goal of the client is to provide a visual feedback, what happens in the emu.

## Prereq

You need to compile the WPC Emu first, run `npm run client` in the root directory.

## Loading ROM

You can load any rom that available and downloadable with the fetch browser API. This means CORS needs to
be set correctly on the server. See https://www.dynatrace.com/support/help/cloud-platforms/amazon-web-services/how-do-i-set-up-cors-for-buckets-within-amazon-s3/
for more information.

## Debugging

The debug module (https://github.com/visionmedia/debug) is used for debugging - its
enabled by default in the index.html code, see `localStorage.debug = '*';`.

It's quite expensive to log each opcode - you should consider disabling it if you aim for speed.

## Stop Emu

You can enter `stopEmu();` in the browser console to stop the Emulator.
