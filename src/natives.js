Buffer.implement({
  indexOf:function(chr) {
    for (var i = 0; i < this.length ; i++)
     if(this[i] ==chr) return i;
    return -1;
  }
});

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

String.implement({
  startsWith: function(str){
     return (this.indexOf(str) === 0);
  },
  endsWith:function(str){
    return str ? this.substr(-str.length) == str : true;
  },

  stripEnd:function(end){
    return this.endsWith(end) ? this.substr(0, this.length - end.length) : end;
  },
});


