"use strict";

const crypto = require('crypto');

function createHash(algos) {
  if(!Array.isArray(algos))
    algos = [algos];

  let hashes = algos.reduce((acc, algo) => ({
    ...acc,
    [algo] : crypto.createHash(algo)
  }), {});

  function update(data) {
    for(let algo of algos)
      hashes[algo].update(data);
  }

  function digest(encode) {
    for(let algo of algos)
      hashes[algo] = hashes[algo].digest(encode);
    return hashes;
  }

  return {update, digest};
}

module.exports = createHash;
