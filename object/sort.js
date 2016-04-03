"use strict";


module.exports =  function(that, keys) {
  var out = {};
  keys.forEach(function(k){
    out[k] = that[k];
  });

  return out;
};