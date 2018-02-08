"use strict";

const setImmediate = require('../async/setImmediate');

module.exports = function(fn, bind) {
  var args = [].slice.call(arguments, 2);

  return function() {
    args.push.apply(args, arguments);
    setImmediate(function() {
      if(fn)
        return fn.apply(bind, args);
    });
  };
};
