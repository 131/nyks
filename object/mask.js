"use strict";

var format= require('util').format; //TODO : use sprintf instead
var forIn = require('mout/object/forIn');

module.exports =  function(that, mask, glue) {
  var out = [];
  forIn(that, function(v, k) {
    out.push( format(mask, k, v) );
  });

  return out.join(glue);
};