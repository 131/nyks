"use strict";

/** 
* return call with only one param
*/

module.exports = function(cb){
  return function(arg){
    return cb(arg);
  }
}
