require('./natives/array.js');
require('./natives/buffer.js');
require('./natives/object.js');
require('./natives/string.js');
require('./natives/function.js');
require('./natives/math.js');

Function.prototype.static = function(){
  this.$static = true;
  return this;
}

var legacy = Class.prototype.implement;
Class.implement('implement', function(k,v){
  if(v && v.$static) this[k] = v;
  else legacy.apply(this, [k, v]);
}.overloadSetter());




