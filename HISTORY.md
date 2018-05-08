# HISTORY

## 8/05/18

- Debug UI use adaptive FPS to stick at 2000ops/ms

## 7/05/18

![07.05.18](assets/07.05.18.png?raw=true)

- DMD shading works (2bit aka 4 Colours)
- implemented switch matrix input
- implemented lamp matrix output
- implemented general illumination output,
- debug ui updates (performance improvements, use defined colour schema, rearrange, cleanup)
- use xo/eslint

## 4/05/18

![04.05.18](assets/04.05.18.png?raw=true)

- autorelease cabinet keys after 100ms
- implemented switch matrix input - non working yet
- minor debug ui updates

## 3/05/18

- cabinet keyboard works somehow, implemented inputSwitchMatrix
- fixed emu initialisation - no more waiting until 600M CPU ticks are over!
- update build process (babel minify, prod/dev build, Travis CI)

## 1/05/18

![01.05.18](assets/01.05.18.png?raw=true)

- implement FIRQ source
- update readme
- add more tests
- start working on input matrix

## 30/04/18
- added cycle time to actually copy video buffer scanline per scanline
- fixed DMD FIRQ generation

## 26/04/18

![26.04.18](assets/26.04.18.png?raw=true)

- DMD display works kind of, displays some images
