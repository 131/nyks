"use strict";

var forIn = require('mout/object/forIn');

module.exports = function(that, key, column){

  let out = {};
  let iteratee = Array.isArray(that)
        ? Array.prototype.forEach.bind(that)
        : forIn.bind(null, that);
  iteratee(function(v, k){
    out[v[key]] = column == undefined ? v : v[column];
  });

  return out;
}