"use strict";

const forIn   = require('mout/object/forIn');
const sprintf = require('../string/format');

module.exports = function(coll, valueMask, keyMask) {
  var ret = {};
  forIn(coll, function(v, k) {
    ret[sprintf(keyMask || "%s", k, v) ] = valueMask == null ? v : sprintf(valueMask, v, k);
  });

  return ret;
}

