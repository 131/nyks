"use strict";

module.exports = function() {
  var thisresolve, thisreject;

  var defer = new Promise(function(resolve, reject) {
    thisresolve = resolve;
    thisreject  = reject;
  });

  defer.resolve = function(body){ thisresolve(body); };
  defer.reject  = function(err){ thisreject(err); };


  return defer;
}

