"use strict";

const path = require('path');
const startsWith = require('mout/string/startsWith');

module.exports = function(base, file) {
  var rest = path.join.apply(path, arguments);
  if(!startsWith(rest, base))
    throw `path.jail escape attempt in ${base}/${file}`;
  return rest;
};