"use strict";

module.exports = function(worker){

  return function(payload, chain) {
    worker(payload).then(function(body) {
      chain(null, body)
    }).catch(chain);
  };

}