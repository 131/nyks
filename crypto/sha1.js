"use strict";

const crypto = require('crypto');

module.exports = function(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
};
