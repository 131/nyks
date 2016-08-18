"use strict";

const throttle  = require('../async/throttle');
const promisify = require('../function/promisify');
const nodeify   = require('./nodeify');

  //this is a shame
module.exports = function(worker, limit) {

  var fetch;

  fetch = nodeify(worker);
    fetch = throttle(fetch, limit);
  fetch = promisify(fetch);

  return fetch;

}

