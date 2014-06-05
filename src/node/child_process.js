var cp = require('child_process');

  //child_process.exec only wait for console, this use process spawn
cp.exec_window = function(cmd, args, callback){
  var ps = cp.spawn(cmd, args);
  ps.on('close', callback);
}
