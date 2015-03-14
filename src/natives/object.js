var util = require('util');

Object.combine = function(list, values) { 
  if (list == null) return {};
  var result = {};
  for (var i = 0, length = list.length; i < length; i++)
    result[list[i]] = values[i];
  return result;
};

Object.sort = function(that, keys){
  var o = {};
  Array.each(keys, function(k){
    if(k in that) o[k] = that[k]; 
  });
  return o;
};


Object.column = function(that, column_key, index_key){
  var o = {};
  Object.each(that, function(v, k) {
    o[index_key ? v[index_key] : k] =  v[column_key];
  });
  return o;
}


Object.set = function(that, k, v){
  that[k] = v;
  return that;
}

Object.mask_join = function(that, glue, format) {
  var out = [];
  Object.each(that, function(v, k){
    out.push( util.format(format, k, v));
  });
  return out.join(glue);
};
