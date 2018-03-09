"use strict";

const path       = require('path');
const fs         = require('fs');
const mkdirpSync = require('./mkdirpSync');

function patchJSON(target, cb, src) {
  var entry = JSON.parse(fs.readFileSync(src || target));
  let returned = cb(entry);
  mkdirpSync(path.dirname(target));
  fs.writeFileSync(target, JSON.stringify((returned === undefined) ? entry : returned, null, 2));
}

module.exports = patchJSON;
