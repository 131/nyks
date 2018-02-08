"use strict";

const path = require('path');

module.exports = function fileUrl(str) {

  var pathName = path.resolve(str).replace(/\\/g, '/');

  // Windows drive letter must be prefixed with a slash
  if (pathName[0] !== '/')
    pathName = '/' + pathName;

  return encodeURI('file://' + pathName);
};
