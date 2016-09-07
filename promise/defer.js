"use strict";

module.exports = function() {
  var thisresolve, thisreject;

  var defer = new Promise(function(resolve, reject) {
    thisresolve = resolve;
    thisreject  = reject;
  });

  defer.resolve = function(body){ thisresolve(body); };
  defer.reject  = function(err){ thisreject(err); };

  defer.chain   = function(err, body){
    if(err)
      return defer.reject(err);
    return defer.resolve(body)
  }

  return defer;
}

