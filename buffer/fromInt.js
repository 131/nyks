"use strict";

function int2buff(value, length) {
  var  i = length || 4, out = new Array(i);
  while(i--) {
    out[i] = value%0x100;
    value >>= 8;
  }
  return new Buffer(out);
}

module.exports = int2buff;
