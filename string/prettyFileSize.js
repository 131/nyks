"use strict";

const sprintf = require('./format');

module.exports = function (bytes) {
  var size = ['B','kB','MB','GB','TB','PB','EB','ZB','YB'];
  var factor = Math.floor((bytes.toString().length - 1) / 3);
  return sprintf("%s%s", Math.floor(100 * bytes / Math.pow(1024, factor)) / 100, size[factor]);
};
