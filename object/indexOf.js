"use strict";

module.exports = function(obj, value){
  for(var k in obj)
    if(obj[k] == value)
      return k;

  return null;
}