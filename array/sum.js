"use strict";

module.exports = function(values){
  return values.reduce(function(a, b){return a+b;});
};