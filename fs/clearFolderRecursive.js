var sort = require("mout/array/sort");
var diff = require("mout/date/diff");
var fs   = require('fs');
var walkFolderStatsRecursive = require("./walkFolderStatsRecursive");

module.exports = function(file_path , options , callback){
  var self = this ;

  file_to_keep = options.file_to_keep || [];
  size_to_delete  = options.size_to_delete || 0;
  max_size   = options.max_size;
  max_age   = options.max_age;

  var fileList = [];
  var filedeleted  = [];
  var time = new Date() ;
  var totalSize = 0 ;
  walkFolderStatsRecursive(file_path, function(statfile){

    var file = {
        file_age  : diff(time, statfile.mtime),
        file_size : statfile.size,
        file_path : statfile.file_path,
    };

    totalSize += statfile.size;
    fileList.push(file)
  }, function(){




    fileList = sort(fileList, function(a, b){
      return -(a.file_age - b.file_age) ;
    })  // return filelist of {file_age file_size file_path}


    var size = 0 ;
    var i    = 0 ;
    if(max_size)
      size_to_delete = totalSize - max_size;
    while (i < fileList.length && size_to_delete > 0 && size + fileList[i].file_size < size_to_delete) {
      if(fs.existsSync(fileList[i].file_path) && !(fileList[i].file_path in file_to_keep)){
        size = size + fileList[i].file_size ;
        fs.unlinkSync(fileList[i].file_path);
        filedeleted.push(fileList[i]);
      }
      i++
    }

    if(max_age){
      var j    = 0, deleteme;
      while ( j < fileList.length && fileList[j].file_age > max_age ) {
        deleteme = fs.existsSync(fileList[j].file_path) && !(fileList[j].file_path in file_to_keep);
        if(deleteme){
          fs.unlinkSync(fileList[j].file_path) ;
          filedeleted.push(fileList[j]);
        }
        j++ ;
      }
    }
    callback(null , filedeleted)
  })
}
