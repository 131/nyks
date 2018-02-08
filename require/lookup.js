"use strict";

//return the module a file belong to
const path = require('path');
const fs   = require('fs');

var modules        = {};
var packages_paths = {}; //cache

function findPackage(file_path) {
  file_path = path.resolve(file_path);
  var paths = file_path.split(path.sep);
  if(packages_paths[file_path])
    return packages_paths[file_path];

  for(var n = paths.length - 1; n > 0; n--) {
    var package_path = (paths.slice(0, n).concat("package.json")).join(path.sep);
    if(fs.existsSync(package_path))
      return packages_paths[file_path] = package_path;
  }

  throw `can't find ${file_path} package`;
}

module.exports = function(file_path) {
  var package_path = findPackage(file_path);
  if(modules[package_path])
    return modules[package_path];
  var module = require(package_path);
  module.package_path = package_path;
  return modules[package_path] = module;
};
