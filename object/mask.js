"use strict";

const format = require('../string/sprintf');
const forIn  = require('mout/object/forIn');

module.exports = function(that, mask, glue) {
  var out = [];
  forIn(that, function(v, k) {
    out.push(format(mask, k, v));
  });

  return out.join(glue);
};
