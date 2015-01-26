Buffer.implement({
  indexOf:function(chr) {
    for (var i = 0; i < this.length ; i++)
     if(this[i] ==chr) return i;
    return -1;
  }
});