"use strict";

//pipe a stream to another, streams might be promises

function pipe(src, dest, options) {

  if(src.then) {
    return src.then(function(tmp) {
      return pipe(tmp, dest, options);
    });
  }

  if(dest.then) {
    return dest.then(function(tmp) {
      return pipe(src, tmp, options);
    });
  }

  return new Promise(function(resolve, reject) {
    src.pipe(dest, options);
    src.on('error', reject);
    if(!("fd" in dest))
      dest.on('finish', resolve);
    dest.on('close', resolve);
  });

}

module.exports = pipe;
