"use strict";

// read once in a stream, return the contents as a buffer

function read(stream) {

  if(stream.then)
    return stream.then(read);

  return new Promise(function(resolve, reject) {

    //if stream as already been drained (or is closed), returns a void buffer
    var state = stream._readableState;
    if(state && state.ended && !state.length)
      resolve(null);

    if(stream.isPaused())
      resolve(stream.read());


    let onData = function (result) { cleanup(); resolve(result); };
    let onEnd = function () { cleanup(); resolve(null); };
    let onError = function (err) { cleanup(); reject(err); };

    stream.once('data', onData);
    stream.once('end', onEnd);
    stream.once('error', onError);

    let cleanup = function() {
      stream.removeListener('data', onData);
      stream.removeListener('error', onError);
      stream.removeListener('end', onEnd);
    };

    return stream;
  });
}


module.exports = read;
