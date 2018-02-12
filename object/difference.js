"use strict";

const union        = require("mout/array/union");
const keys         = require('mout/object/keys');

module.exports = (obj1, obj2) => {
  var ids = union(keys(obj1), keys(obj2));
  var modified = [];
  ids.forEach((id) => {
    var valObj1 = obj1[id];
    var valObj2 = obj2[id];
    if(!valObj1 || !valObj2 || valObj1 != valObj2)
      modified.push(id);
  });
  return modified;
};
