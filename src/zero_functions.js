
(function(){

  this.bool = function(str){
    str = str.toLowerCase();
    return str && str != "false" && str != "no" && str != "n" && str != "f";
  }

})();


