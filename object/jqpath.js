"use strict";

const stripsStart = require('../string/stripStart');

const jqpath = function(obj, path) {
  if(!path)
    return obj;

  let rmatch  = new RegExp("^\\.(?:\"([^\"]*)\"|'([^']*)'|([a-z0-9_]+)|\\[\"([^\"]*)\"\\]|\\['([^']*)'\\])", "i");

  if(rmatch.test(path)) {
    let [all, ...matches] = rmatch.exec(path);
    let value = matches.find(v => v !== undefined);
    path = stripsStart(path, all);
    return jqpath(obj[value], path);
  }

  if(path[0] == ".")
    return jqpath(obj, path.substr(1));

  return undefined;
};


module.exports = jqpath;
