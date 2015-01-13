var fs = require('fs');
var http = require('http');

http.downloadFile = function(remote_url, file_path, callback){
    var file = fs.createWriteStream(file_path);
    var request = http.get(remote_url, function(response) {
      response.on('end', function(){
        callback(null, file_path);
      });
      response.pipe(file);
    });
}


