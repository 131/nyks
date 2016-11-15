"use strict";


module.exports =  function(fn) {
  var running = false;
  return function* () {
    var args = [].slice.call(arguments);
    if(running)
      throw "Already running !";

    running = true;

    try {
      var res = yield fn.apply(this, args);
      return res;
    } finally {
      running = false;
    }
  }
}
