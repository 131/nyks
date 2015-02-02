String.implement({
  replaces : function(hash) {
    var self = this;
    Object.each(hash, function(v, k){
      self = self.replace(k, v);
    });
    return self;
  },

    //recursive version of replaces
  rreplaces : function(hash) {
    var tmp = "", i = this;
    do {
        tmp = i;
        i = i.replaces(hash);
    } while(tmp != i);
    return tmp;
  },

  startsWith : function(str) {
     return (this.indexOf(str) === 0);
  },
  endsWith : function(str) {
    return str ? this.substr(-str.length) == str : true;
  },

  stripEnd : function(end) {
    return this.endsWith(end) ? this.substr(0, this.length - end.length) : this.toString();
  },

  stripStart : function(start) {
    return this.startsWith(start) ? this.substr(start.length) : this.toString();
  },

// http://stackoverflow.com/q/617647
  rot13 : function() {
    return this.replace(/[a-zA-Z]/g, function(a){
      return String.fromCharCode( ((a=a.charCodeAt())<91?78:110)>a ? a+13 : a-13 );
    });
  }

});
