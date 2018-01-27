"use strict";

// drain a stream, return the contents as a buffer

function drain(stream) {

  if(stream.then)
    return stream.then(drain);

  return new Promise(function(resolve, reject) {

    var body = [];

    //if stream as already been drained (or is closed), returns a void buffer
    var state = stream._readableState;
    if(state && state.ended && (state.destroyed || state.endEmitted))
      resolve(Buffer.concat(body));

    stream.on('error', reject);

    stream.on('data', function(buf) {
      body.push(buf);
    });

    stream.on('end', function() {
      resolve(Buffer.concat(body));
    });

    return stream;
  });
}


module.exports = drain;
