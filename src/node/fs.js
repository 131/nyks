
var fs = require('fs'),
  crypto = require('crypto'),
  path = require('path'),
  os = require('os');

fs.md5FileSync = function(file_path){
  var md5 = crypto.createHash('md5');
  md5.update(fs.readFileSync(file_path));
  return md5.digest('hex');
}


fs.isFileSync = function(file_path){
 return fs.statSync(file_path).isFile();
}

fs.isDirectorySync = function(file_path){
 return fs.statSync(file_path).isDirectory();
}


fs.md5File = function (file_path, callback){
  var shasum = crypto.createHash('md5');
  var s = fs.ReadStream(file_path);
  s.on('data', shasum.update.bind(shasum));
  s.on('end', function() {
    callback(null, shasum.digest('hex'));
  });
}


fs.filesizeSync = function(file_path){
  return fs.statSync(file_path)["size"];
}
fs.filemtimeSync = function(file_path){
  return fs.statSync(file_path)["mtime"];
}


fs.renameCross = function(src, dst, callback){
  var readStream = fs.createReadStream(src)
  var writeStream = fs.createWriteStream(dst);
  readStream.pipe(writeStream);
  writeStream.on('finish', function(){
    fs.unlinkSync(src);
    callback();
  });
}


fs.tmppath    = require('../../fs/tmppath');
fs.mkdirpSync = require('../../fs/mkdirpSync');

fs.deleteFolderRecursive = function(file_path) {
    var files = [];
    if( fs.existsSync(file_path) ) {
        files = fs.readdirSync(file_path);
        files.forEach(function(file,index){
            var curfile_path = file_path + "/" + file;
            if(fs.lstatSync(curfile_path).isDirectory()) { // recurse
                fs.deleteFolderRecursive(curfile_path);
            } else { // delete file
                fs.unlinkSync(curfile_path);
            }
        });
        fs.rmdirSync(file_path);
    }
};

