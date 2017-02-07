"use strict";

const Writable = require('stream').Writable;

const pipe = function (promise) {
  var body = new Buffer('');

  var stream = new Writable({
    write: function(chunk, encoding, next) {
      body = Buffer.concat([body, chunk]);
      next();
    }
  });

  stream.on('finish', function(){
    promise.resolve(body);
  });

  return stream;
}


module.exports = pipe;