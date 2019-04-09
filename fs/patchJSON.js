"use strict";

const fs         = require('fs');
const writeLazySafeSync = require('./writeLazySafeSync');

function patchJSON(target, cb, src) {
  var entry = {};
  try {
    entry = JSON.parse(fs.readFileSync(src || target));
  } catch(err) { }

  let returned = cb(entry);

  returned = JSON.stringify((returned === undefined) ? entry : returned, null, 2);
  writeLazySafeSync(target, returned);
}

module.exports = patchJSON;
