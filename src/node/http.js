var fs = require('fs'),
    http = require('http'),
    https = require('https');


var download = function(transport, remote_url, file_path, callback){

    var request = transport(remote_url, function(response) {
      if (response.statusCode != 200)
        return callback( {error: "Invalid http exit code", code: response.statusCode });

      var file = fs.createWriteStream(file_path);

      file.on('finish', function () {
        file.close(function(){
          callback(null, file_path);
        });
      });

      response.pipe(file);
    }).on('error', function(){
      callback( {error:"Cannot reach remote endpoint " + remote_url});
    });

}

http.downloadFile = function(remote_url, file_path, callback){
    if(remote_url.startsWith('https://'))
      return https.downloadFile(remote_url, file_path, callback);

    return download(http.get, remote_url, file_path, callback);
}


https.downloadFile = function(remote_url, file_path, callback){
    return download(https.get, remote_url, file_path, callback);

}


http.JSON = function(remote_url, callback){
  var body = '';
  var transport = remote_url.startsWith('https://') ? https : http;

  transport.get(remote_url, function(res){
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