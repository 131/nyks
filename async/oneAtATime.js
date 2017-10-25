"use strict";


module.exports =  function(fn, ctx) {
  var running = false;
  return async function () {
    var args = [].slice.call(arguments);
    if(running)
      throw "Already running !";

    running = true;

    try {
      var res = await fn.apply(ctx || this, args);
      return res;
    } finally {
      running = false;
    }
  };
};
