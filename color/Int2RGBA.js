"use strict";

  //what did you expect..
module.exports = function(i) {

  return {
    r : (i>>24)&0xFF,
    g : (i>>16)&0xFF,
    b : (i>>8) &0xFF,
    a : i      &0xFF,
  };
};