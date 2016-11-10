
module.exports =  function(fn) {
  var my = function*(){
    var args = [].slice.call(arguments);
    if(my.running)
      throw "ALLREADY RUNNING";
    my.running= true;
    try {
      var res = yield fn(args);
      my.running = false;
      return res;
    } catch(err) {
      my.running = false;
      throw err;
    }
  }
  return my;
}