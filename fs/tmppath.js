var fs   = require('fs');
var path = require('path');
var os   = require('os');
var crypto = require('crypto');

var exitListenerAttached = false;
var filesToDelete = [];

function deleteOnExit(file_path) {

  if (!exitListenerAttached) {
    console.log("Registering for cleanup");
    process.on('exit', cleanupFilesSync);
      //makes sure exit is called event on sigint \o/
    process.on('SIGINT', process.exit);
    exitListenerAttached = true;
  }

  filesToDelete.push(file_path);
}


function cleanupFilesSync() {
  while ((toDelete = filesToDelete.shift()) !== undefined) {
    if(fs.existsSync(toDelete))
      fs.unlinkSync(toDelete);
  }
}

  


var tmppath = module.exports = function(ext, len, trash){
  len = len || 8; ext = ext || "tmp";
  if(trash === undefined) trash = true;


  var body = crypto.randomBytes(len).toString('base64').replace(/\//g, '+').substr(0, len);
  var fname = ext + "-" + body + "." + ext;
  var file_path = path.join(os.tmpdir(), fname);

  var fullpath = fs.existsSync(file_path) ? tmppath(ext) : file_path;
  if(trash)
    deleteOnExit(fullpath);

  return fullpath;
}

