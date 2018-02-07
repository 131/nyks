"use strict";

const PassThrough = require('stream').PassThrough;

module.exports = function(data) {
  var tmp = new PassThrough();
  tmp.end(data);
  return tmp;
};
