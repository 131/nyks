'use strict';

const fs            = require('fs');
const path          = require('path');

const mkdirpsync    = require('./mkdirpSync');
const writeFileSync = require('./writeFileSync');

var writeLazySafeSync = (file_path, body) => {
  var initialdata;
  try {
    initialdata = fs.readFileSync(file_path, 'utf-8');
    if(initialdata == body)
      return false;
  } catch(err) { }

  mkdirpsync(path.dirname(file_path));

  var tmp_path = file_path + '.tmp';

  writeFileSync(tmp_path, body);
  fs.renameSync(tmp_path, file_path);

  //make SURE data are written on disk before returning
  var data = fs.readFileSync(file_path, 'utf-8');

  /* eslint-disable-next-line */
  if(data != body) {
    if(initialdata !== undefined)
      fs.writeFileSync(file_path, initialdata);
    throw `Could not safely touch file ${file_path}, this should never happen`;
  }

  return true;
};

module.exports = writeLazySafeSync;
