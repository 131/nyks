"use strict";

const path = require('path');
const fs = require('fs');
const isDirectorySync = require('./isDirectorySync');

function deleteFolderRecursive(file_path) {
  var files = [];
  if(fs.existsSync(file_path)) {
    files = fs.readdirSync(file_path);
    files.forEach(function(file) {
      var curfile_path = path.join(file_path, file);
      if(isDirectorySync(curfile_path)) { // recurse
        deleteFolderRecursive(curfile_path);
      } else { // delete file
        fs.unlinkSync(curfile_path);
      }
    });
    fs.rmdirSync(file_path);
  }
}


module.exports = deleteFolderRecursive;

