"use strict";

const exec = require('child_process').exec;
const existsSync = require('fs').existsSync;
const sprintf = require('../string/format');
const defer = require('../promise/defer');

const IS_WINDOWS = require('os').platform() == "win32";


module.exports = function rmrf(dir) {
  if(!existsSync(dir))
    return Promise.resolve(true);

  var defered = defer();
  /*istanbul ignore next*/
  var cmd = sprintf(IS_WINDOWS ? 'rd /s /q "%s"' : 'rm -rf "%s"', dir);
  var child = exec(cmd, defered.chain);
  return defered;
};
