"use strict";

/* istanbul ignore else */
if(typeof process === 'object')
  module.exports = function(fn, bind) {
    return function() {
      var args = arguments;
      process.nextTick(function(){
        return fn.apply(bind, args);
      })
    };
  };
else
  module.exports = function(fn, bind) {
    return  function() {
      var args = arguments;
      setTimeout(function(){
        return fn.apply(bind, args);
      }, 0);
    };
  };
