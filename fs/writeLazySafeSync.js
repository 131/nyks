'use strict';

const fs         = require('fs');
const mkdirpsync = require('./mkdirpSync');
const path       = require('path');

var writeLazySafeSync = (file_path, body) => {
  try {
    var data = fs.readFileSync(file_path, 'utf-8');
    if(data == body)
      return false;
  } catch(err) { }

  mkdirpsync(path.dirname(file_path));
  var tmp_path = file_path + '.tmp';
  fs.writeFileSync(tmp_path, body);
  fs.renameSync(tmp_path, file_path);
  return true;
};

module.exports = writeLazySafeSync;
