"use strict";

const path       = require('path');
const fs         = require('fs');
const mkdirpSync = require('./mkdirpSync');


function patchJSON(target, cb, src) {
  var entry = JSON.parse(fs.readFileSync(src || target));
  cb(entry);
  mkdirpSync(path.dirname(target));
  fs.writeFileSync(target, JSON.stringify(entry, null, 2));
}


module.exports = patchJSON;

