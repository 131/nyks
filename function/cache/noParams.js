"use strict";

// cache a function that is called with no parameters

function cache(fn) {
  let init = Symbol();
  let value = init;

  let ret = function() {
    if(arguments.length != 0)
      return fn.apply(this, arguments);

    if(value == init)
      value = fn.apply(this, arguments);
    return value;
  };

  ret.clear = function() {
    value = init;
  };
  return ret;
}

module.exports = cache;

