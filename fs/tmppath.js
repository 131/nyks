var fs   = require('fs');
var path = require('path');
var os   = require('os');

var randString   = require('mout/random/randString');

var tmppath = module.exports = function(ext){
  ext = ext || "tmp";
  var fname = ext + "-" + randString(8) + "." + ext;
  var file_path = path.join(os.tmpdir(), fname);

  return fs.existsSync(file_path) ? tmppath(ext) : file_path;
}

