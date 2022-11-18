"use strict";

var defer = require('../promise/defer');

module.exports =  function(fn, ctx) {
  var wait = null;

  return async function () {
    var args = [].slice.call(arguments);
    if(wait)
      return wait;

    try {
      wait = defer();
      var res = await fn.apply(ctx || this, args);
      wait.resolve(res);
      return wait;
    } catch(err) {
      wait.reject(err);
      return wait;
    } finally {
      wait = null;
    }
  };
};
