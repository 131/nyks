"use strict";


module.exports =  function(fn) {
  var my = function* () {
    var args = [].slice.call(arguments);
    if(my.running)
      throw "Already running !";

    my.running= true;

    try {
      var res = yield fn(args);
      return res;
    } finally {
      my.running = false;
    }
  }

  return my;
}