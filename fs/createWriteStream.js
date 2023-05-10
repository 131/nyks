"use strict";

const fs = require('fs');

const createWriteStream = function(...opts) {
  let dst = fs.createWriteStream(...opts);

  return new Promise((resolve, reject) => {
    if(dst.fd)
      return resolve(dst);

    dst.on('error', reject);
    dst.on('open', resolve.bind(null, dst));
  });
};

module.exports = createWriteStream;
