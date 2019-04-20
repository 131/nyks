"use strict";

const PassThrough = require('stream').PassThrough;

module.exports = function(data, end) {
  if(end === undefined)
    end = true;

  var tmp = new PassThrough();
  tmp.write(data);
  if(end)
    tmp.end();
  return tmp;
};
