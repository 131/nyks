"use strict";

const fs = require('fs');
const crypto = require('crypto');

function hashFile(file_path, hash, cb) {

  if(!Array.isArray(hash))
    hash = [hash];

  let hashes = hash.reduce((acc, hash) => ({
    ...acc,
    [hash] : crypto.createHash(hash)
  }), {});

  var input = fs.createReadStream(file_path);
  for(let hash in hashes)
    input.on('data', hashes[hash].update.bind(hashes[hash]));

  input.on('end', function() {
    for(let hash in hashes)
      hashes[hash] = hashes[hash].digest('hex');
    cb(null, hashes);
  });
}

module.exports = hashFile;
