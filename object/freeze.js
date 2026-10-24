"use strict";

// Freeze an own data-property graph in place, preserving aliases and cycles.
const freeze = function(obj) {
  const seen = new WeakSet();

  const visit = function(value) {
    if(value === null || !['object', 'function'].includes(typeof value) || seen.has(value))
      return value;

    seen.add(value);
    for(const key of Reflect.ownKeys(value)) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if(descriptor && 'value' in descriptor)
        visit(descriptor.value);
    }
    return Object.freeze(value);
  };

  return visit(obj);
};

module.exports = freeze;
