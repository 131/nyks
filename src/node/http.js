var fs = require('fs');
var http = require('http');


http.downloadFile = function(remote_url, file_path, callback){
    var file = fs.createWriteStream(file_path);

    var request = http.get(remote_url, function(response) {

      file.on('finish', function () {
        file.close(function(){
          callback(null, file_path);
        });
      });

      response.pipe(file);
    });
}


http.JSON = function(remote_url, callback){
  var body = '';
  http.get(remote_url, function(res){
    if (res.statusCode != 200)
      return;

    res.on('data', function (data) {
      body += data;
    });

    res.on('end', function () {
      callback(null, JSON.parse(body));
    });
  }).on('error', callback);
}

//deprecated pollyfill
http.json = function(remote_url, callback, error) {
  http.JSON(remote_url, function(err, data) {
    if(err)
      return error(err);
    return callback(data);
  });
}