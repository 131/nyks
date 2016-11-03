"use strict";

const setImmediate = require('../async/setImmediate');

module.exports = function(fn, bind) {
  return function() {
    var args = arguments;
    setImmediate(function(){
      if(fn)
        return fn.apply(bind, args);
    })
  };
};
