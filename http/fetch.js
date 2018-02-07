"use strict";

//return a promise that resolve to a stream from a dummy get
const get = require('./get');

module.exports = function(target) {
  return new Promise(function(resolve, reject) {
    get(target, resolve).on('error', reject);
  });
};
