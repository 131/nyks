"use strict";

const createHash = require('../crypto/createHash');
const {Transform} = require('stream');


const digest = function(algo) {
  let hash = createHash(algo);

  let stream = new Transform({

    transform(chunk, encoding, callback) {
      hash.update(chunk);
      callback(null, chunk);
    }
  });

  stream.digest = function(encode) {
    return hash.digest(encode);
  };

  return stream;
};


module.exports = digest;
