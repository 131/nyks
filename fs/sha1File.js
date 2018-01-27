"use strict";

const fs = require('fs');
const crypto = require('crypto');


function sha1File(file_path, callback) {
  var shasum = crypto.createHash('sha1');
  var s = fs.ReadStream(file_path);
  s.on('data', shasum.update.bind(shasum));
  s.on('end', function() {
    callback(null, shasum.digest('hex'));
  });
}

module.exports = sha1File;
