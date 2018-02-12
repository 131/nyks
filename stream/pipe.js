"use strict";

//pipe a stream to another, streams might be promises

function pipe(src, dest) {

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
    src.on('error', reject);
    dest.on('finish', resolve);
    dest.on('close', resolve);
  });

}

module.exports = pipe;
