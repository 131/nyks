"use strict";

module.exports = function(name) {
  var args = [].slice.call(arguments, 1);
  return function * (element) {
    return yield element[name].apply(element, args);
  };
};
