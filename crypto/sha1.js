"use strict";

const crypto = require('crypto');

module.exports = function(str, digest = 'hex') {
  return crypto.createHash('sha1').update(str).digest(digest);
};

