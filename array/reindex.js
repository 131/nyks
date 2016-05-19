"use strict";

module.exports = function(that, index){
  let out = {};
  that.forEach(function(v) {
    out[v[index]] = v;
  });
  return out;
};