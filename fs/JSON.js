"use strict";

var fs = require('fs');


module.exports = function(file_path){
  return JSON.parse(fs.readFileSync(file_path));
}