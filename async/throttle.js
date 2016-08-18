"use strict";

const queue = require('async/queue');


module.exports = function(worker, limit) {
  let q = queue(worker, limit);

  return function(/*payload, chain*/) {
    var args = [].slice.apply(arguments),
        chain = args.pop(),
        payload = args.shift();
    q.push(payload, chain);
  };

}

