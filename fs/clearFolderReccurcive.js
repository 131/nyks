var sort = require("mout/array/sort");
var diff = require("mout/date/diff");
var fs   = require('fs');
var readFolderRecursive = require("./readFolderRecursive");

module.exports = function(file_path , options , callback){
  var self = this ;

  file_to_keep = options.file_to_keep || [];
  size_to_delete  = options.size_to_delete || 0;
  max_size   = options.max_size;
  max_time   = options.max_time;

  var fileList = [];
  var filedeleted  = [];
  var time = new Date() ;
  var totalSize = 0 ;
  readFolderRecursive(file_path, function(statfile){
    var file = {};
    file["file_time"] = diff(time, statfile.mtime);
    file["file_size"] = statfile.size;
    file["file_path"] = statfile.file_path;
    totalSize += statfile.size;
    fileList.push(file)
  }, function(){
    fileList = sort(fileList, function(a, b){
      return -(a.file_time - b.file_time) ;
    })  // return filelist of {file_time file_size file_path}
    var size = 0 ;
    var i    = 0 ;
    if(max_size)
      size_to_delete = totalSize - max_size;
    while (size_to_delete > 0 && size + fileList[i].file_size < size_to_delete && i < fileList.length) {
      size = size + fileList[i].file_size ;
      if(fs.existsSync(fileList[i].file_path) && !(fileList[i].file_path in file_to_keep)){
        fs.unlinkSync(fileList[i].file_path);
        filedeleted.push(fileList[i]);
      }
      i++
    }

    if(max_time){
      var j    = 0 ;
      while ( fileList[j].file_time > max_time && j < fileList.length) {
        if(fs.existsSync(fileList[j].file_path) && !(fileList[j].file_path in file_to_keep)){
          fs.unlinkSync(fileList[j].file_path) ;
          filedeleted.push(fileList[j]);
        }
        j++ ;
      }
    }
    callback(null , filedeleted)
  })
}
