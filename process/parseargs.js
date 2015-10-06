"use strict";

var util   = require('util');
var startsWith = require('mout/string/startsWith');


module.exports = function(argv){
  if(arguments.length == 0)
     argv = process.argv.slice(2);

  var args = [], dict = {},
      k, v, r, e = new RegExp("^--?([a-z_0-9/:-]+)(?:=(.*))?", "i");

  argv.forEach(function(arg){
    if(!startsWith(arg, '-')) {
      args.push(arg);
    } else if(e.test(arg)) {
      r = e.exec(arg);
      k = r[1], v = r[2] === undefined ? true : r[2];
      if(dict[v] !== undefined) {
        if(typeOf(dict[k]) != "array") dict[k] = [dict[k]];
        dict[k].push(v);
      } else dict[k] = v;
    }
  });

  return {args:args, dict:dict};
}
