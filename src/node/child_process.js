var cp = require('child_process');

  //child_process.exec only wait for console, this use process spawn
cp.exec_window = function(cmd, args, callback, error){
  var ps = cp.spawn(cmd, args);
  ps.on('close', callback);
  ps.on('error', error || function(){} );
}
