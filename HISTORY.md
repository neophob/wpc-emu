# HISTORY

## 7/05/18

![07.05.18](assets/07.05.18.png?raw=true)

- DMD shading works (2bit aka 4 colors)
- implemented switch matrix input
- implemented lamp matrix output
- debug ui updates (performance improvments, use defined color schema, rearrange, cleanup)
- use eslint

## 4/05/18

![04.05.18](https://raw.githubusercontent.com/neophob/wpc-emu/master/assets/04.05.18.png)

- autorelease cabinet keys after 100ms
- implemented switch matrix input
- fixed dmd page write issue
- minor debug ui updates

## 3/05/18

- cabinet keyboard works somehow, implemented inputSwitchMatrix
- fixed emu initialisation - no more waiting until 600M CPU ticks are over!
- update build process (babel minify, prod/dev build, travic ci)

## 1/05/18

![01.05.18](https://raw.githubusercontent.com/neophob/wpc-emu/master/assets/01.05.18.png)

- implement FIRQ source
- update readme
- add more tests
- start working on input matrix

## 30/04/18
- added cycle time to actually copy video buffer scanline per scanline
- fixed DMD FIRQ generation

## 26/04/18

![26.04.18](https://raw.githubusercontent.com/neophob/wpc-emu/master/assets/26.04.18.png)

- DMD display works kind of, displays some images
