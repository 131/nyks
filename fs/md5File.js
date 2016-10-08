"use strict";

const fs = require('fs');
const crypto = require('crypto');

module.exports = function md5File (file_path, cb) {

  var output = crypto.createHash('md5')
  var input = fs.createReadStream(file_path)

  input.on('error', cb)

  output.once('readable', function () {
    cb(null, output.read().toString('hex'))
  })

  input.pipe(output)
}

