"use strict";
//TODO : use https://www.npmjs.com/package/json-path if needed

var trim = require('mout/string/trim');

module.exports = function(obj, fqnn_path) {
  var path = trim(fqnn_path, ['/']).split('/'), step,
      cursor = obj;

  for (var i = 0; i < path.length; i++) {
    step = path[i];
    if(cursor && cursor[step]) {
      cursor = cursor[step];
    } else {
      return null;
    }
  }
  return cursor;
};
