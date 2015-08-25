"use strict";

var cp = require('child_process');

  //callback(err, exit, lastline);
module.exports = function(cmd, options, chain){
    if(Array.isArray(options))
      options = { args : options} ;
    options = options || {};

  var ps   = cp.spawn(cmd, options.args || [], options),
      _ret = "";

  ps.on('error', function(err){
    ps.removeAllListeners('close');
    ps.on('close', function(exit) {
      return chain(err, exit);
    });
  });
  ps.stdout.pipe(process.stdout);
  ps.stderr.pipe(process.stderr);
  ps.stdout.on("data", function(data){
    _ret = data.toString();
  });

  ps.on('close', function(exit) {
    return chain(null, exit, _ret);
  });
}

