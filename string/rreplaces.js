"use strict";

//recursive version of replaces
const replaces = require('./replaces');

module.exports = function(str, hash) {
  var tmp = "";
  do {
    tmp = str;
    str = replaces(str, hash);
  } while(tmp != str);
  return tmp;
};
