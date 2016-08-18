"use strict";

const queue = require('async/queue');


module.exports = function(worker, limit) {
  let q = queue(worker, limit);

  return function(payload, chain) {
    q.push(payload, chain);
  };

}

