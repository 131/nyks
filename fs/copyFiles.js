'use strict';

const fs   = require('fs');
const path = require('path');

const isFileSync = require('./isFileSync');
const mkdirpSync = require('./mkdirpSync');

function copyFiles(files, target_dir, options) {

  if(!options)
    options = {};

  if(typeof files == 'string')
    files = [files];

  var cwd = options.cwd || process.cwd();

  files.forEach((file_path, index) => {
    if(!isFileSync(path.join(cwd, file_path)))
      return;

    let current_dir = path.dirname(file_path);
    let content     = fs.readFileSync(path.join(cwd, file_path));

    mkdirpSync(path.join(target_dir, current_dir));

    if(options.process)
      content = options.process(content, file_path, index);

    fs.writeFileSync(path.join(target_dir, file_path), content);
  });

}

module.exports = copyFiles;
