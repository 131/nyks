"use strict";

const crypto = require('crypto');

module.exports = function(algo, key, str) {
  return crypto.createHmac(algo, key).update(str).digest('hex');
};
