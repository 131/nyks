"use strict";

const freeze = function(obj) {
  if(obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.values(obj).forEach(freeze);
  }
  return obj;
};

module.exports = freeze;
