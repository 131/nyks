
Function.prototype.static = function(){
  this.$static = true;
  return this;
}

var legacy = Class.prototype.implement;
Class.implement('implement', function(k,v){
  if(v && v.$static) this[k] = v;
  else legacy.apply(this, [k, v]);
}.overloadSetter());




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
  replaces : function(hash){
    var self = this;
    Object.each(hash, function(v, k){
      self = self.replace(k, v);
    });
    return self;
  },

    //recursive version of replaces
  rreplaces : function(hash){
    var tmp = "", i = this;
    do {
        tmp = i;
        i = i.replaces(hash);
    } while(tmp != i);
    return tmp;
  },

  startsWith: function(str){
     return (this.indexOf(str) === 0);
  },
  endsWith:function(str){
    return str ? this.substr(-str.length) == str : true;
  },

  stripEnd:function(end){
    return this.endsWith(end) ? this.substr(0, this.length - end.length) : this.toString();
  },

  stripStart:function(start){
    return this.startsWith(start) ? this.substr(start.length) : this.toString();
  },
});


Array.implement({
  diff : function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0;} );
  }
});


if (!Date.now) {
  Date.now = function() { return new Date().getTime() / 1000; }
}

