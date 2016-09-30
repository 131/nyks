"use strict";

const fs = require('fs');
const crypto = require('crypto');

module.exports = function md5File (file_path, cb) {
  if (typeof cb !== 'function')
      throw new TypeError('Argument cb must be a function')

  var output = crypto.createHash('md5')
  var input = fs.createReadStream(file_path)

  input.on('error', cb)

  output.once('readable', function () {
    cb(null, output.read().toString('hex'))
  })

  input.pipe(output)
}

