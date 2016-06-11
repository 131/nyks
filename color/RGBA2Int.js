"use strict";


module.exports = function(a){
  if(Array.isArray(a))
    a = {r:a[0],g:a[1],b:a[2],a:a[3]};

  return   (a.r&0xFF)<<24
          | (a.g&0xFF)<<16
          | (a.b&0xFF)<<8
          | (a.a&0xFF);
}