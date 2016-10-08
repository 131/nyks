"use strict";

const cp    = require('child_process');
const once  = require('../function/once');


module.exports = function(cmd /*, options, chain*/){
  var args = Array.from(arguments),
      chain    = once(args.pop()),
      cmd      = args.shift(),
      options  = args.shift() || {};

  if(Array.isArray(options))
    options = { args : options};

  options.stdio = ['inherit', 'inherit', 'inherit'];

  var ps   = cp.spawn(cmd, options.args || [], options);

  ps.on('error', chain);

  ps.on('close', function(exit) {
    var err = null;
    if(exit !== 0)
      err = "Bad exit code " + exit;
    return chain(err, exit);
  });
}

