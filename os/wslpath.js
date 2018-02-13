"use strict";

const cp    = require('child_process');
const defer = require('../promise/defer');

function wslpath(arg, path) {
  var defered = defer();
  cp.execFile('wslpath',  [arg, path], defered.chain);
  return defered.then(path => path.trim());
}

module.exports = wslpath;
