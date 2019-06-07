"use strict";

const fs = require('fs');

const createWriteStream = function(path) {
  let dst = fs.createWriteStream(path);
  return new Promise((resolve, reject) => {
    dst.on('error', reject);
    dst.on('open', resolve.bind(null, dst));
  });
};

module.exports = createWriteStream;
