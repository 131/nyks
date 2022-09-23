"use strict";


const walk = function(obj, processor) {
  if(obj === null)
    return obj;

  if(typeof obj === 'object') {
    for(const [key, value] of Object.entries(obj))
      obj[key] = walk(value, processor);
    return obj;
  }

  if(typeof obj === 'string')
    return processor(obj);

  return obj;

};


module.exports = walk;
