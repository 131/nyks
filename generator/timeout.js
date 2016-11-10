const defer      = require('../promise/defer');
const isNumber   = require('mout/lang/isNumber');

module.exports =  function(fn, timeout) {
  var my = function*(){
    var args = [].slice.call(arguments);
    
    if(!timeout)
      return yield fn(args);

    if(!isNumber(timeout))
      throw "timeout must be a number";

    var defered = defer();
    setTimeout(defered.reject.bind(defered, "timeout"), timeout);

    yield [ function*() {
      var response = yield fn(args);
      defered.resolve(response);
    }, defered];

    return defered;
  }
  return my;
}