"use strict";

const stripsStart = require('../string/stripStart');

const jqdive = function(obj, path) {
  if(!path || obj == undefined)
    return obj;

  if(path[0] == ".")
    return jqdive(obj, path.substr(1));

  let rmatch  = new RegExp("^(?:\"([^\"]*)\"|'([^']*)'|([a-z0-9_]+)|\\[\"([^\"]*)\"\\]|\\['([^']*)'\\])", "i");

  if(rmatch.test(path)) {
    let [all, ...matches] = rmatch.exec(path);
    let value = matches.find(v => v !== undefined);
    path = stripsStart(path, all);
    return jqdive(obj[value], path);
  }

  return undefined;
};


/**
* get "nested" object property
*/

function dive(obj) { //..., path
  var parts = [].slice.call(arguments, 1);
  for(let part of parts) {
    if(part == null) return;
    if(obj == null || obj === undefined) return;

    if(obj[part] != null) {
      obj = obj[part];
      continue;
    }

    obj = jqdive(obj, part);
  }

  return obj;
}

module.exports = dive;
