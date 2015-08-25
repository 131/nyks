"use strict";


module.exports = function(npath){
  var paths = process.env.PATH.split(path.delimiter).concat(Array.from(arguments));
  return process.env.PATH = paths.join(path.delimiter);
}