
var fs = require('fs'),
  crypto = require('crypto');

fs.md5FileSync = function(path){
  var md5 = crypto.createHash('md5');
  md5.update(fs.readFileSync(path));
  return md5.digest('hex');
}


fs.deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                fs.deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

