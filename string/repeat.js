"use strict";

// mout/string/repeat seems too complicated sometimes

module.exports = function(str, times) { 
  return Array.apply(null, {length:times + 1}).join(str)
};
