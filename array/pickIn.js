"use strict";

module.exports = function(value, values){
  var i = values.indexOf(value);
  return values[i !== -1 ? i : 0];
};