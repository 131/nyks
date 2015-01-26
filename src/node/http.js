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



http.json = function(remote_url, callback){
  var body = '';
  var req = http.get(remote_url, function(res){
    if (res.statusCode != 200)
      return;

    res.on('data', function (data) {
      body += data;
    });

    res.on('end', function () {
      callback(JSON.parse(body));
    });
  });

}