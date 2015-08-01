var indexOfc : function(buf, chr) {
  for (var i = 0; i < buf.length ; i++)
   if(buf[i] ==chr) return i;
  return -1;
}


module.exports = function(buf, search, offset) {
  if(typeof search == "string")
    search = new Buffer(search);
  else if(typeof search == "number")
    search = new Buffer([search]);

  offset = offset||0

  var m = 0;
  var s = -1;
  for(var i=offset;i<buf.length;++i){
    if(buf[i] == search[m]) {
      if(s == -1) s = i;
      ++m;
      if(m == search.length) break;
    } else {
      s = -1;
      m = 0;
    }
  }

  if (s > -1 && buf.length - s < search.length) return -1;
  return s;
}
