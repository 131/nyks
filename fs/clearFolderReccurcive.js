var sort = require("mout/array/sort");
var diff = require("mout/date/diff");
var fs   = require('fs');
var readFolderRecursive = require("./readFolderRecursive");

module.exports = function(file_path , max_size , max_time , callback){
  var self = this ;

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
    if(max_size){
      var size = 0 ;
      var i    = 0 ;
      var toDelete = totalSize - max_size;
      while (toDelete > 0 && size + fileList[i].file_size < toDelete && i < fileList.length) {
        size = size + fileList[i].file_size ;
        if(fs.existsSync(fileList[i].file_path)){
          fs.unlinkSync(fileList[i].file_path);
          filedeleted.push(fileList[i]);
        }
        i++
      }
    }
    if(max_time){
      var i    = 0 ;
      while ( fileList[i].file_time > max_time && i < fileList.length) {
        if(fs.existsSync(fileList[i].file_path)){
          fs.unlinkSync(fileList[i].file_path) ;
          filedeleted.push(fileList[i]);
        }
        i = i + 1 ;
      }
    }
    callback(null , filedeleted)
  })
}
