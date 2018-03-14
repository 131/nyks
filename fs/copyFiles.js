'use strict';

const fs   = require('fs');
const path = require('path');

const isFileSync = require('./isFileSync');
const mkdirpSync = require('./mkdirpSync');
const sprintf    = require('../string/format');

module.exports = function copyFiles(files, target_dir, patchCb) {

  if(typeof files == 'string')
    files = [files];

  files.forEach((file_path) => {
    if(!isFileSync(file_path))
      return;

    let current_dir = path.dirname(file_path);
    let content     = '' + fs.readFileSync(file_path);

    mkdirpSync(sprintf('%s/%s', target_dir, current_dir));

    if(typeof patchCb == 'function')
      content = patchCb(content);

    fs.writeFileSync(sprintf('%s/%s', target_dir, file_path), content);
  });

};
