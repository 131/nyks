"use strict";

module.exports = function(str){
  var ret = new Array(str.length), len = str.length;
  while(len--) ret[len] = str.charCodeAt(len);
  return ret;
}