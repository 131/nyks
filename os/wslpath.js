"use strict";

const cp    = require('child_process');
const defer = require('../promise/defer');

function wslpath(type, path) {
  var defered = defer();
  if (['-u', '-w', '-m', '-r', '-s'].indexOf(type) == -1)
    return defer.reject('invalid type');
  cp.execFile('wslpath',  [type, path], defered.chain);
  return defered.then(path => path.trim());
}

module.exports = wslpath;
