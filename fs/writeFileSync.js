'use strict';

const fs = require('fs');

//fs.writeFileSync has been broken until node 21, data on hard drive has never been flushed !
var writeFileSync = (file_path, body) => {
  const fd = fs.openSync(file_path, 'w');

  fs.writeSync(fd, body);
  //now, they are
  fs.fsyncSync(fd);
  fs.closeSync(fd);
  return true;
};

module.exports = writeFileSync;
