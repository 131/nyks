"use strict";

var pow2  = [1, 2, 4, 8, 16, 32, 64, 128, 256];
var dmod = [128, 192, 224, 240, 248, 252, 254, 255]; //revert modulo
var neg  = [127, 191, 223, 239, 247, 251, 253, 254]; //xor


function writeBits(target, source, bitoffset, sourcebitLength){
  if(sourcebitLength === undefined)
    sourcebitLength = source.length << 3;

  if(!sourcebitLength)
    return 0;

  var soucebitStart = sourcebitLength < 0 ? (source.length<<3) + sourcebitLength : 0,
      sourcebitLength  = Math.min(Math.abs(sourcebitLength), (target.length <<3) - bitoffset),
      sourceBitEnd  = soucebitStart +  sourcebitLength - 1;


  for(var v, i = soucebitStart, j=bitoffset; i<= sourceBitEnd; i++, j++)
    if(source[i>>3] & pow2[7-i%8])
      target[j>>3]    |= pow2[7-j%8];
    else target[j>>3] &= neg[j%8];

  return sourcebitLength;
}


module.exports = writeBits;