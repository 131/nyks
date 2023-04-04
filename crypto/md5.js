"use strict";

const crypto = require('crypto');

module.exports = function(str, digest = 'hex') {
  return crypto.createHash('md5').update(str).digest(digest);
};
