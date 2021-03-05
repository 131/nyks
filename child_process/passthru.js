"use strict";

const {spawn} = require('child_process');
const wait  = require('./wait');

module.exports = function(cmd, args = [], options = {}) {
  if(!Array.isArray(args))
    (options = args), (args = options.args || []);

  options.stdio = 'inherit';
  var child = spawn(cmd, args, options);
  return wait(child);
};

