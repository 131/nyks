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

    src.once('error', function(err) {
      dest.removeListener('finish', resolve);
      dest.removeListener('close', resolve);
      reject(err);
    });

    if(!("fd" in dest))
      dest.once('finish', resolve);
    dest.once('close', resolve);
  });

}

module.exports = pipe;
