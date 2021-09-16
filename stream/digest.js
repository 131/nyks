"use strict";

const createHash = require('../crypto/createHash');
const {Transform} = require('stream');


const digest = function(algo) {
  let hash = createHash(algo);

  let size = 0;
  let stream = new Transform({

    transform(chunk, encoding, callback) {
      hash.update(chunk);
      size += chunk.length;
      callback(null, chunk);
    }
  });

  stream.digest = function(encode) {
    let ret = hash.digest(encode);
    ret.size = size;
    return ret;
  };

  return stream;
};


module.exports = digest;
