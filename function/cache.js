"use strict";

// protect a function and cache multiple calls with same parameters
// cache only forward the 1st parameter


module.exports = function(fn) {
  var cache = {};

  return function(arg) {
    if(arg in cache)
      return cache[arg];

    cache[arg] = fn.apply(this, arguments);
    return cache[arg];
  };
};
