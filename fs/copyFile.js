'use strict';

const fs   = require('fs');
const once = require('../function/once');

module.exports = function copyFile(source, target, chain) {
  chain = once(chain);

  var rd = fs.createReadStream(source);
  rd.once('error', chain);

  var wr = fs.createWriteStream(target);
  wr.once('error', chain);
  wr.once('close', chain);

  rd.pipe(wr);
};


