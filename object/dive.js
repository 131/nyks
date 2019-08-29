"use strict";

/**
* get "nested" object property
*/

function dive(obj) { //..., path
  var parts = [].slice.call(arguments, 1);
  for(let part of parts) {
    if(part == null) return;
    if(obj == null) return;

    if(obj[part] != null) {
      obj = obj[part];
      continue;
    }

    for(let spart of String(part).split('.')) {
      if(obj == null) return;
      obj = obj[spart];
    }
  }
  return obj;
}

module.exports = dive;
