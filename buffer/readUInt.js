"use strict";

var pow2 = [];
for (var i = 0; i < 32; i++)
  pow2[i] = Math.pow(2, i);



function unsigned(buffer, offset, length) {

  var result = 0, blen = buffer.length * 8, offset = offset || 0;

  if(offset < 0)
    offset = blen + offset;

  if(length === undefined)
    length = blen - offset;

  if(!length)
    return 0;

  for(var i=0, j = offset + length - 1; i<length;i++, j--)
    result += buffer[j >>3] & pow2[7-j%8] ? pow2[i] : 0;

  return result;
}

module.exports = unsigned;
