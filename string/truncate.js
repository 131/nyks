"use strict";

module.exports = function(/* str, len[, pad = '…'] */) {
  var args = [].slice.apply(arguments);
  var str = args.shift();
  var len = args.shift() || 10;
  var pad = args.shift() || '…';

  if(str.length <= Math.abs(len))
    return str;

  if(len < 0)
    return pad + str.substr(len + pad.length);
  return str.substr(0, len - pad.length) + pad;
};
