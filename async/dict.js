"use strict";

var dictLimit = require('./dictLimit');

module.exports = function(keys, iterator, chain){
  dictLimit(keys, 1, iterator, chain);
}
