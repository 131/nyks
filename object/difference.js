"use strict";

const union        = require("mout/array/union");
const keys         = require('mout/object/keys');

module.exports = (obj1, obj2) => {
  var stream_ids = union(keys(obj1), keys(obj2));
  var modified = [];
  stream_ids.forEach((stream_id) => {
    var valObj1 = obj1[stream_id];
    var valObj2 = obj2[stream_id];
    if(!valObj1 || !valObj2 || valObj1 != valObj2)
      modified.push(stream_id);
  });
  return modified;
};
