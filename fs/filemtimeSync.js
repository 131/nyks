"use strict";

const fs = require('fs');

module.exports = function(file_path) {
  return fs.statSync(file_path)["mtime"];
};

