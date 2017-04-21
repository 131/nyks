"use strict";

// drain a stream, return the contents as a buffer

module.exports = function drain(stream) {

  if(stream.then)
    return stream.then(drain);

  return new Promise(function(resolve, reject) {

    var body = [];

    stream.on('error', reject);

    stream.on('data', function(buf){
      body.push(buf);
    });

    stream.on('end', function(){
      resolve(Buffer.concat(body));
    });


    return stream;
  });

}
