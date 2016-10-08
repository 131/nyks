"use strict";

const cp = require('child_process');
const once  = require('../function/once');

  //callback(err, exit, lastline);
module.exports = function(cmd/*, options, chain*/){

  var args = Array.from(arguments),
      chain    = once(args.pop()),
      cmd      = args.shift(),
      options  = args.shift() || {};

  if(Array.isArray(options))
    options = { args : options};

  var ps   = cp.spawn(cmd, options.args || [], options);
  var _stdout = "", _stderr = "";

  ps.on('error', chain);

  ps.stdout.on("data", function(data){ _stdout += data; });
  ps.stderr.on("data", function(data){ _stderr += data; });

  ps.on('close', function(exit) {
    return chain(exit, _stdout, _stderr);
  });

  return ps;
}

