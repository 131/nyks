"use strict";

const existsSync = require('fs').existsSync;
const path       = require('path');
/** 
* differs from require.resolve as
* this will never check against a revision
* this will return the package.json folder, not the package entry point
*/

/*istanbul ignore next */ //coverage unreachable but when browserified
const search_paths = module.paths || []; 


search_paths.unshift(path.join(process.cwd(), 'node_modules'));

module.exports = function(module_name) {
 for(var i = 0; i< search_paths.length; i++)
  if(existsSync(path.join(search_paths[i], module_name, "package.json")))
    return path.join(search_paths[i], module_name);
  throw "nope";
}


