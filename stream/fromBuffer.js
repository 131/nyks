"use strict";

var PassThrough = require('stream').PassThrough;

module.exports = function(data){
  var tmp = new PassThrough();
  tmp.end(data);
  return  tmp;
}