"use strict";

const jqdive     = require('../object/jqdive');



const replaceEnv = function(str, dict) {
  let mask = /(?:\$\$([a-z0-9._-]+))|(?:\$\$\{([^}]+)\})/ig, match;

  let touched = false;
  while((match = mask.exec(str))) {
    const key = match[1] || match[2];
    let v = jqdive(dict, key);
    if(v === undefined)
      continue;
    if(typeof v == "object")
      return v;
    touched = true;

    str = str.replace(match[0], v);
  }

  if(touched)
    return replaceEnv(str, dict);
  return str;
};

module.exports = replaceEnv;
