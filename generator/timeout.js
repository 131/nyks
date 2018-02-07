"use strict";

const defer    = require('../promise/defer');
const isNumber = require('mout/lang/isNumber');

module.exports = function(fn, timeout, ctx) {
  if(!timeout)
    return fn;

  if(!isNumber(timeout))
    throw "timeout must be a number";

  var my = function* () {
    var args    = [].slice.call(arguments);
    var self    = ctx || this;
    var defered = defer();

    setTimeout(defered.reject.bind(defered, "timeout"), timeout);

    yield [function * () {
      var response = yield fn.apply(self, args);
      defered.resolve(response);
    }, defered];

    return defered;
  };

  return my;
};
