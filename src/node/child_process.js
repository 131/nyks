var cp = require('child_process');

  //child_process.exec only wait for console, this use process spawn
cp.exec_window = function(cmd, args, callback, error){
  var ps = cp.spawn(cmd, args);
  ps.on('close', callback);
  ps.on('error', error || function(){} );
}


  //callback(err, exit, lastline);
cp.passthru = function(cmd, options, chain){
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

  ps.stdout.on("data", function(data){
    _ret = data.toString();
    console.log(data.toString());
  });

  ps.stderr.on("data", function(data){
    console.err(data.toString())
  });

  ps.on('close', function(exit) {
    return chain(null, exit, _ret);
  });
}
