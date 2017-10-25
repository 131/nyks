"use strict";

module.exports = function(str) {
  var ret = new Array(str.length);
  var len = str.length;
  while(len--) {
    ret[len] = str.charCodeAt(len);
  }
  return ret;
};
