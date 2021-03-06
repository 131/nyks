"use strict";

module.exports = function(callee) {
  var thisresolve;
  var thisreject;

  var defer = new Promise(function(resolve, reject) {
    thisresolve = resolve;
    thisreject  = reject;
  });

  defer.resolve = function(body) { thisresolve(body); };
  defer.reject  = function(err) { thisreject(err); };
  defer.chain   = function(err, body) {
    if(err)
      return defer.reject(err);
    return defer.resolve(body);
  };
  if(callee)
    callee(defer);

  return defer;
};
