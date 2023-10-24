'use strict';

const md5FileSync       = require('./md5FileSync');
const writeLazySafeSync = require('./writeLazySafeSync');
const md5               = require('../crypto/md5');

var writeAndCheck = (file_path, body, maxRetry = 10) => {
  var expected  = md5(body);
  var notok     = true;
  var iteration = 0;
  var result    = false;

  do {
    result = writeLazySafeSync(file_path, body);
    notok  = md5FileSync(file_path) != expected || iteration >= maxRetry;

    iteration++;
  } while(notok);

  return result;
};

module.exports = writeAndCheck;
