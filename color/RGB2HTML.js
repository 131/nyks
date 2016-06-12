"use strict";


module.exports = function(a) {
  if(Array.isArray(a))
    a = {r:a[0],g:a[1],b:a[2]};

  return  "#" 
           + ("00" + a.r.toString(16)).substr(-2)
           + ("00" + a.g.toString(16)).substr(-2)
           + ("00" + a.b.toString(16)).substr(-2)
}