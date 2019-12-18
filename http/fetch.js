"use strict";

//return a promise that resolve to a stream from a dummy get
const get = require('./get');

module.exports = function(target, options) {
  let timeout = options && options.timeout || 60 * 1000;

  return new Promise(function(resolve, reject) {
    let i = setTimeout(reject, timeout, `Timeout in http fetch for ${target}`);

    get(target, (data) => {
      clearTimeout(i);
      resolve(data);
    }).on('error', (err) => {
      clearTimeout(i);
      reject(err);
    });
  });
};
