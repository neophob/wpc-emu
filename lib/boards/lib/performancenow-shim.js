'use strict';

const debug = require('debug')('wpcemu:boards:lib:performancenow-shim');

if (typeof(window) === 'undefined') {
  global.performance = {};
  global.performance.now = () => { return process.hrtime().join('.'); };
  debug('shim installed', performance.now());
} else {
  console.log('no shim needed');
}
