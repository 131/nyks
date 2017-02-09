"use strict";

//pipe a stream to another, streams might be promises

const pipe = function(src, dest) {

  if(src.then)
    return src.then(function(tmp) {
      return pipe(tmp, dest);
    });

  if(dest.then)
    return dest.then(function(tmp) {
      return pipe(src, tmp);
    });

  return new Promise(function(resolve, reject) {
      src.pipe(dest);
      dest.on('close', resolve);
  });

}



module.exports = pipe;