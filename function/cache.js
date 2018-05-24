"use strict";

// protect a function and cache multiple calls with same parameters
// cache only forward the 1st parameter


module.exports = function(fn, timeout = 3600 * 1000, gc_interval = 1) {
  var cache = {};
  var last_call = Date.now();


  return function(arg) {

    if(Date.now() - last_call > timeout / gc_interval) {
      last_call = Date.now();
      for(var k of Object.keys(cache)) {
        if(cache[k].expires < last_call)
          delete cache[k];
      }
    }

    if(arg in cache)
      return cache[arg].value;

    cache[arg] = {expires : Date.now() + timeout, value : fn.apply(this, arguments)};

    return cache[arg].value;
  };
};
