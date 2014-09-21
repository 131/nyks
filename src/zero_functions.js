
(function(){

  this.bool = function(str){
    str = str.toLowerCase();
    return str && str != "false" && str != "no" && str != "n" && str != "f";
  }

  // Helper to build a guid
  // From https://stackoverflow.com/a/8809472
  this.guid = function(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  }


})();


