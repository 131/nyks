"use strict";


module.exports =  function(list, values) {
  var result = {};
  if (list == null)
      return result;
  for (var i = 0, length = list.length; i < length; i++)
    result[list[i]] = values[i];
  return result;
};

