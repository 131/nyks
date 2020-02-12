'use strict';

const fs         = require('fs');
const path       = require('path');

const mkdirpsync = require('./mkdirpSync');
const rename     = require('./rename');

var writeLazySafe = (file_path, body, cb) => {
  try {
    var data = fs.readFileSync(file_path, 'utf-8');
    if(data == body)
      return cb(null, false), false;
  } catch(err) { }

  mkdirpsync(path.dirname(file_path));
  var tmp_path = file_path + '.tmp';
  fs.writeFileSync(tmp_path, body);

  /*istanbul ignore next*/
  rename(tmp_path, file_path).then(() => {
    cb && cb(null, true);
  }).catch((err) => {
    cb && cb(err);
  });

  return true;
};

module.exports = writeLazySafe;
