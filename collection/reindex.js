"use strict";

var forIn = require('mout/object/forIn');

module.exports = function(that, key){
  let out = {};
  let iteratee = Array.isArray(that)
        ? Array.prototype.forEach(that)
        : forIn.bind(null, that);
  iteratee(function(v, k){
    out[v[key]] = v;
  });

  return out;
}