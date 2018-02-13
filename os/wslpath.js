"use strict";

const cp    = require('child_process');
const defer = require('../promise/defer');

function wslpath(path) {
  var defered = defer();
  cp.exec(`wslpath -w ${path}`, defered.chain);
  return defered.then(path => path.trim());
}

module.exports = wslpath;
