"use strict";

const cp    = require('child_process');
const defer = require('../promise/defer');

function wslpath() {
  var defered = defer();
  cp.execFile('wslpath',  [].slice.apply(arguments), defered.chain);
  return defered.then(path => path.trim());
}

module.exports = wslpath;
