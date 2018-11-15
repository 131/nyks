"use strict";

const fs       = require('fs');
const path     = require('path');


const readdir = function * (dir) {
  var entries = fs.readdirSync(dir);
  entries.sort();

  for(let entry of entries) {
    let filepath = path.join(dir, entry);
    try {
      let stat = fs.statSync(filepath);
      if(stat.isDirectory()) {
        for(let subpath of readdir(filepath))
          yield subpath;
      } else {
        yield filepath;
      }
    } catch(err) {// stat failure
    }
  }
};




module.exports = readdir;
