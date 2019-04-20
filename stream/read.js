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

    stream.once('data', resolve);
    stream.once('end', resolve);
    stream.on('error', reject);
    return stream;
  });
}


module.exports = read;
