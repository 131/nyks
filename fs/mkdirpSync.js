"use strict";

const fs   = require('fs');
const path = require('path');

function mkdirpsync(file_path) {
  if(fs.existsSync(file_path))
    return file_path;

  mkdirpsync(path.dirname(file_path));
  fs.mkdirSync(file_path);
  return file_path;
}

module.exports = mkdirpsync;
