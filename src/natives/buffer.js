Buffer.implement({

  indexOfc : function(chr) {
    for (var i = 0; i < this.length ; i++)
     if(this[i] ==chr) return i;
    return -1;
  },

  indexOf : function(search, offset) {
    if(typeof search == "string")
      search = new Buffer(search);
    else if(typeof search == "number")
      search = new Buffer([search]);

    offset = offset||0

    var m = 0;
    var s = -1;
    for(var i=offset;i<this.length;++i){
      if(this[i] == search[m]) {
        if(s == -1) s = i;
        ++m;
        if(m == search.length) break;
      } else {
        s = -1;
        m = 0;
      }
    }

    if (s > -1 && this.length - s < search.length) return -1;
    return s;
  }
});